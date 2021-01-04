<template>
  <main class="main row">
    <div class="col-3 main__left">
      <UserNavBar />
      <ChatList />
    </div>

    <div class="col main__center">
      <NoSelectedMessage />
    </div>

    <div class="col-3 main__right" v-if="isVisibleRight">
      <p>The chat right components</p>
    </div>
  </main>
</template>

<script>
export default {
  name: "LayoutDefault",
  components: {
    NoSelectedMessage: () => import("./components/NoSelectedMessage.vue"),
    ChatList: () => import("./components/ChatList.vue"),
    UserNavBar: () => import("./components/UserNavBar.vue")
  },

  data() {
    return {
      isVisibleRight: false
    };
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  &__center {
    background: #263238;
  }
}
</style>
