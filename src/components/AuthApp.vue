<template>
  <section class="main row">
    <div class="col-3 main__left">
      <AuthUserProfile
        v-if="leftComponent === 'profile'"
        @handleLeftNavigation="leftComponent = 'chat-list'"
        :authUser="user"
      />
      <!-- ChatList fully renders when the contacted users data is available from the API call. We may show loading indicator -->
      <ChatList
        v-if="leftComponent === 'chat-list' && contactedUsers"
        :users="contactedUsers"
        :authUser="user"
        @handleLeftNavigation="handleLeftNavigation"
        @selectUser="handleSelectUser"
      />
      <NewChatList
        v-if="leftComponent === 'new-chat-list'"
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
        this.initializePrivateChatListener(res.data.id);
      } catch (error) {
        console.log(error);
      }
    },

    fetchContactedUsers() {
      return getContactedUsers()
        .then(res => {
          this.contactedUsers = res.data.map(obj => ({
            ...obj,
            avatar_url: this.getUserDp(obj.avatar_path)
          }));
        })
        .catch(err => {
          console.log(err);
        });
    },

    // The direct query builder doesn't get us the avatar_url attribute in the contacted_users query
    // so we just have to compute it manually and pass it over to the other components to maintain uniformity
    // this will not be needed when I sort out the query from the backend to use Eloquent

    /// This is kind of intensive computation
    getUserDp(avatar_path) {
      if (avatar_path) {
        return `https://${process.env.VUE_APP_AWS_BUCKET}.s3.amazonaws.com/${avatar_path}`;
      }
      return avatar_path;
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

      // update unread count
      let userIndex = this.contactedUsers.findIndex(
        user => user.id === userInfo.id
      );
      if (userIndex >= 0) this.contactedUsers[userIndex].unread_count = 0;
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
              Api.post(
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
          if (typingUserIndex >= 0) {
            this.$set(this.contactedUsers[typingUserIndex], "isTyping", true);
          }

          // reset timer
          setTimeout(() => {
            if (typingUserIndex >= 0) {
              this.$set(
                this.contactedUsers[typingUserIndex],
                "isTyping",
                false
              );
            }
          }, 2000);
        }
      });
    },

    // this reorders the chat list when a new message comes in
    // and updates the unread count if the person is not the currently selected user
    async handleChatListReorder(userIndex, message) {
      // that is if the user is present, Update the message and created_at
      if (userIndex >= 0) {
        this.contactedUsers[userIndex].message = message.message;
        this.contactedUsers[userIndex].created_at = message.created_at;
      } else {
        // this means the user is not in this list
        // so fetch the contactedUsers data again
        let updatedUsersList = await getContactedUsers();
        this.contactedUsers = updatedUsersList.data;
      }
      // if the receiver is not the currently selected user or there is no currently selected user
      // update the unread_count
      if (
        userIndex >= 0 &&
        parseInt(this.contactedUsers[userIndex].id) !==
          parseInt(this.selectedUserInfo.id)
      ) {
        this.contactedUsers[userIndex].unread_count += 1;
      }

      // if user the receiver is not at the top of the list, reorder the list
      if (userIndex > 0) {
        // reorder the list
        // 1. get the value
        // 2. remove it from the contactedUsers using split
        // 3. Add to the top using unshift.
        let valueStore = this.contactedUsers[userIndex];
        this.contactedUsers.splice(userIndex, 1);
        this.contactedUsers.unshift(valueStore);
      }
    },
    // Private message listener
    initializePrivateChatListener(userId) {
      window.Echo.private(`private-chat-channel.${userId}`).listen(
        "SendPrivateWossopMessage",
        async ({ message }) => {
          // if the sender is the authenticated user
          const isAuthUserSender = message.sender === userId;

          const senderIndex = this.contactedUsers.findIndex(
            user => user.id === message.sender
          );

          const receiverIndex = this.contactedUsers.findIndex(
            user => user.id === message.receiver
          );

          if (isAuthUserSender) {
            this.handleChatListReorder(receiverIndex, message);
          } else {
            this.handleChatListReorder(senderIndex, message);
          }
        }
      );
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

    // starting private listeners
    if (isUser) this.initializePrivateChatListener(this.user.id);
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
