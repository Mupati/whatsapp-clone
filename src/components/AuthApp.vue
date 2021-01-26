<template>
  <section class="main row">
    <div class="col-3 main__left">
      <AuthUserProfile
        v-if="leftComponent === 'profile'"
        @handleLeftNavigation="leftComponent = 'chat-list'"
        :authUser="user"
      />
      <ChatList
        v-if="leftComponent === 'chat-list' && contactedUsers"
        :users="contactedUsers"
        @handleLeftNavigation="handleLeftNavigation"
        @selectUser="handleSelectUser"
      />
      <NewChatList
        v-if="leftComponent === 'new-chat-list' && contactedUsers"
        @handleLeftNavigation="leftComponent = 'chat-list'"
        @selectUser="handleSelectUser"
      />
    </div>

    <div class="col main__center">
      <ChatArea
        v-if="isUserSelected"
        @handleRightNavigation="handleRightNavigation"
        :userInfo="selectedUserInfo"
        :onlineStatus="selectedUserOnlineStatus"
        :allMessages="allMessages"
        :messagingChannel="onlineChannel"
        :authUserId="user.id"
      />
      <NoSelectedMessage v-else />
    </div>

    <div class="col-3 main__right" v-if="isVisibleRight">
      <SelectedUserProfile
        v-if="rightComponent === 'user-profile'"
        @hideRightSection="isVisibleRight = false"
        :userInfo="selectedUserInfo"
        :onlineStatus="selectedUserOnlineStatus"
      />
    </div>
  </section>
</template>

<script>
// import Peer from "simple-peer";
import Echo from "laravel-echo";
import axios from "axios";
import { formatRelative, parseISO } from "date-fns";
import { getUser, getContactedUsers, getToken, Api } from "../api";

window.Pusher = require("pusher-js");

export default {
  name: "AuthApp",
  props: ["authUser"],
  components: {
    NoSelectedMessage: () => import("./NoSelectedMessage.vue"),
    ChatList: () => import("./ChatList.vue"),
    NewChatList: () => import("./NewChatList.vue"),
    ChatArea: () => import("./ChatArea.vue"),
    SelectedUserProfile: () => import("./SelectedUserProfile"),
    AuthUserProfile: () => import("./AuthUserProfile")
  },

  data() {
    return {
      leftComponent: "chat-list",
      rightComponent: "user-profile",
      isVisibleRight: false,
      isUserSelected: false,
      selectedUserInfo: {},
      user: this.authUser,
      contactedUsers: null,
      onlineChannel: null,
      onlineUsers: [],
      allMessages: [],
      userTyping: false
    };
  },

  computed: {
    selectedUserOnlineStatus() {
      const userIndex = this.onlineUsers.findIndex(
        user => user.id === this.selectedUserInfo.id
      );
      if (userIndex < 0) {
        // check whether they've recorded their last login before you parse it
        let last_online = Boolean(this.selectedUserInfo.last_login_at);
        if (last_online) {
          return `last seen ${formatRelative(
            parseISO(this.selectedUserInfo.last_login_at),
            new Date()
          )}`;
        }
        return "Offline";
      }
      return "Online";
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const res = await getUser();
        this.user = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    fetchContactedUsers() {
      return getContactedUsers()
        .then(res => {
          this.contactedUsers = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleLeftNavigation(leftComponentName) {
      this.leftComponent = leftComponentName;
    },

    handleRightNavigation(rightComponentName) {
      this.isVisibleRight = true;
      this.rightComponent = rightComponentName;
    },

    handleSelectUser(userInfo) {
      this.isUserSelected = true;
      this.selectedUserInfo = userInfo;
      this.fetchMessages(userInfo.id);
    },

    async fetchMessages(id) {
      Api.get(`/message/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
        .then(res => {
          this.allMessages = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    initializeChannel() {
      window.Echo = new Echo({
        broadcaster: "pusher",
        cluster: process.env.VUE_APP_PUSHER_CLUSTER,
        encrypted: true,
        key: process.env.VUE_APP_PUSHER_APP_KEY,
        authorizer: channel => {
          return {
            authorize: (socketId, callback) => {
              axios
                .post(
                  `${process.env.VUE_APP_BASE_URL}/broadcasting/auth`,
                  {
                    socket_id: socketId,
                    channel_name: channel.name
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${getToken()}`
                    }
                  }
                )
                .then(response => {
                  callback(false, response.data);
                })
                .catch(error => {
                  callback(true, error);
                });
            }
          };
        }
      });
      this.onlineChannel = window.Echo.join("wossop-channel");
    },

    initializeChannelListeners() {
      // all users that are already on the channel
      // at the time the current user logged in.
      this.onlineChannel.here(users => {
        this.onlineUsers = users;
      });

      // when a user is joining
      this.onlineChannel.joining(user => {
        // check whether incoming user already joined
        const userIndex = this.onlineUsers.findIndex(
          data => data.id === user.id
        );
        // add to the onlineUsers array if not available
        if (userIndex < 0) this.onlineUsers.push(user);
      });

      // when user is leaving
      this.onlineChannel.leaving(async user => {
        const userIndex = this.onlineUsers.findIndex(
          data => data.id === user.id
        );
        // remove the leaving user from the onlineUsers array
        this.onlineUsers.splice(userIndex, 1);

        await this.$nextTick();
        // let updatedOnlineUsers = this.onlineUsers.splice(userIndex, 1);
        // this.onlineUsers = updatedOnlineUsers;
        // console.log("Leaving Second", updatedOnlineUsers);
      });

      // Update online status of user who logs out
      // you do this by updating the user's value in the
      this.onlineChannel.listen("UpdateLoginTime", ({ data }) => {
        // update the leaving user's last_login_at in the contactedUsers object.
        const leavingUserIndex = this.contactedUsers.findIndex(
          singleUser => singleUser.id === data.id
        );
        if (this.contactedUsers[leavingUserIndex]) {
          this.contactedUsers[leavingUserIndex].last_login_at =
            data.last_login_at;
        }
      });

      // Listen for  a typing event
      this.onlineChannel.listenForWhisper("typing", e => {
        if (e.receiver === this.user.id) {
          let typingUserIndex = this.contactedUsers.findIndex(
            singleUser => singleUser.id === e.sender
          );
          this.$set(this.contactedUsers[typingUserIndex], "isTyping", true);

          // reset timer
          setTimeout(() => {
            this.$set(this.contactedUsers[typingUserIndex], "isTyping", false);
          }, 2000);
        }
      });

      // I don't know how best to go about this, to have an optimized solution
      // There are a lot of API calls which must be changed later.
      // What I want to do is update the contacted Users in the ChatList so that
      // the lastest messages come to the top.

      // When the authenticated user sends or receives a message, fetchContactedUsers
      this.onlineChannel.listen("SendWossopMessage", async ({ message }) => {
        if (
          message.sender === this.user.id ||
          message.receiver === this.user.id
        ) {
          console.log("contactedUsers", this.contactedUsers);
          const res = await getContactedUsers();
          this.contactedUsers = res.data;
          console.log("updatedContactedUsers", this.contactedUsers);
        }
      });
    },

    disconnectChannel() {
      this.onlineChannel.pusher.channels.channels[
        "presence-wossop-channel"
      ].disconnect();
    }
  },

  mounted() {
    let isUser = Boolean(this.user);
    if (!isUser) this.fetchUserData();

    this.fetchContactedUsers();
    this.initializeChannel();
    this.initializeChannelListeners();
  },

  beforeDestroy() {
    this.disconnectChannel();
  }
};
</script>

<style lang="scss">
.main {
  height: 100%;
  background: #131c21;
  color: #f1f1f2a1;
  &__center {
    height: 100%;
  }
}
</style>
