<template>
  <section class="main row">
    <div class="col-3 main__left">
      <ChatList />
    </div>

    <div class="col main__center">
      <ChatArea v-if="isUserSelected" />
      <NoSelectedMessage v-else />
    </div>

    <div class="col-3 main__right" v-if="isVisibleRight">
      <UserProfile />
    </div>
  </section>
</template>

<script>
import { getUser } from "../api";
export default {
  name: "LayoutDefault",
  components: {
    NoSelectedMessage: () => import("./NoSelectedMessage.vue"),
    ChatList: () => import("./ChatList.vue"),
    ChatArea: () => import("./ChatArea.vue"),
    UserProfile: () => import("./UserProfile")
  },

  data() {
    return {
      isVisibleRight: true,
      isUserSelected: true,
      authUser: null
    };
  },

  methods: {
    async fetchUserData() {
      const authUser = getUser();
      this.authUserInfo = authUser.data;
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
