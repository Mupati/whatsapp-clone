<template>
  <section class="main row">
    <div class="col-3 main__left">
      <AuthUserProfile
        v-if="leftComponent === 'profile'"
        @showChatList="leftComponent = 'chat-list'"
        :authUser="user"
      />
      <ChatList
        v-if="leftComponent === 'chat-list' && allUsers"
        :users="allUsers"
        @handleLeftNavigation="handleLeftNavigation"
        @selectUser="handleSelectUser"
      />
    </div>

    <div class="col main__center">
      <ChatArea
        v-if="isUserSelected"
        @handleRightNavigation="handleRightNavigation"
        :userInfo="selectedUserInfo"
      />
      <NoSelectedMessage v-else />
    </div>

    <div class="col-3 main__right" v-if="isVisibleRight">
      <SelectedUserProfile
        v-if="rightComponent === 'user-profile'"
        @hideRightSection="isVisibleRight = false"
        :userInfo="selectedUserInfo"
      />
    </div>
  </section>
</template>

<script>
// import Peer from "simple-peer";
import Echo from "laravel-echo";
import axios from "axios";
import { getUser, getUsers, getToken } from "../api";
window.Pusher = require("pusher-js");

export default {
  name: "AuthApp",
  props: ["authUser"],
  components: {
    NoSelectedMessage: () => import("./NoSelectedMessage.vue"),
    ChatList: () => import("./ChatList.vue"),
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
      selectedUserInfo: null,
      user: this.authUser,
      allUsers: null,
      onlineChannel: null
    };
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
    fetchAllUsersData() {
      return getUsers()
        .then(res => {
          console.log("AuthApp.vue fetch all users");
          this.allUsers = res.data;
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
    },

    initializeChannel() {
      // window.Echo = new Echo({
      //   broadcaster: "pusher",
      //   key: process.env.VUE_APP_PUSHER_APP_KEY,
      //   authEndpoint: `${process.env.VUE_APP_BASE_URL}/broadcasting/auth`,
      //   cluster: "mt1",
      //   auth: {
      // headers: {
      //   Authorization: `Bearer ${getToken()}`,
      // },
      //   },
      // });

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
                  console.log(response.data);
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
    }
  },

  mounted() {
    let isUser = Boolean(this.user);
    if (!isUser) this.fetchUserData();

    this.fetchAllUsersData();
    this.initializeChannel();
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