<template>
  <main class="main row">
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
  </main>
</template>

<script>
export default {
  name: "LayoutDefault",
  components: {
    NoSelectedMessage: () => import("./components/NoSelectedMessage.vue"),
    ChatList: () => import("./components/ChatList.vue"),
    ChatArea: () => import("./components/ChatArea.vue"),
    UserProfile: () => import("./components/UserProfile")
  },

  data() {
    return {
      isVisibleRight: true,
      isUserSelected: true
    };
  },

  mounted() {
    document.title = "Wossop - Kofi Mupati";
  }
};
</script>

<style lang="scss">
body {
  background: #090e11;
  box-sizing: border-box;
  height: 100vh;
  padding: 1% 7.5% 0;
}
.main {
  height: 100%;
  background: #131c21;
  color: #f1f1f2a1;
  &__center {
    height: 100%;
  }
}
</style>
