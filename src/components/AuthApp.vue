<template>
  <section class="main row">
    <div class="col-3 main__left">
      <AuthUserProfile
        v-if="leftComponent === 'profile'"
        @showChatList="leftComponent = 'chat-list'"
      />
      <ChatList
        v-if="leftComponent === 'chat-list'"
        @handleLeftNavigation="handleLeftNavigation"
        @selectUser="isUserSelected = true"
      />
    </div>

    <div class="col main__center">
      <ChatArea
        v-if="isUserSelected"
        @handleRightNavigation="handleRightNavigation"
      />
      <NoSelectedMessage v-else />
    </div>

    <div class="col-3 main__right" v-if="isVisibleRight">
      <SelectedUserProfile
        v-if="rightComponent === 'user-profile'"
        @hideRightSection="isVisibleRight = false"
      />
    </div>
  </section>
</template>

<script>
import { getUser } from "../api";
export default {
  name: "AuthApp",
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
      authUser: null
    };
  },

  methods: {
    async fetchUserData() {
      const res = getUser();
      this.authUser = res.data;
    },

    handleLeftNavigation(leftComponentName) {
      this.leftComponent = leftComponentName;
    },

    handleRightNavigation(rightComponentName) {
      this.isVisibleRight = true;
      this.rightComponent = rightComponentName;
    }
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
