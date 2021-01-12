<template>
  <main>
    <AuthApp v-if="isLoggedIn" :authUser="authUser" />
    <NonAuthApp v-else />
  </main>
</template>

<script>
// Development pattern. since you are not using statemanagment
// store data for a component that always mounts and unmounts
// in their immediate parent component. In this way data is available
// to components that are directly linked to it without hitting the endpoint
// several times. The challenge now is how to optimize the initial API call.
// you don't want to fetch all your data before the component is fully loaded. Poor UI.
// consider replace async await with promise.then as it blocks the main thread

import AuthApp from "./components/AuthApp";
import NonAuthApp from "./components/NonAuthApp";

import { getToken, clearToken } from "./api";
export default {
  name: "MainApp",
  components: {
    AuthApp,
    NonAuthApp
  },
  data() {
    return {
      isLoggedIn: !!getToken(),
      authUser: null
    };
  },

  methods: {},

  mounted() {
    document.title = "Wossop";
    this.$root.$on("logoutUser", () => {
      this.isLoggedIn = false;
      clearToken();
      // reload to update login status - hack
      location.reload();
    });

    this.$root.$on("loginUser", user => {
      this.isLoggedIn = true;
      this.authUser = user;
    });
  },

  beforeDestroy() {
    this.$root.$off("loginUser");
    this.$root.$off("logoutUser");
  }
};
</script>

<style lang="scss" scoped>
main {
  // background: #090e11;
  box-sizing: border-box;
  height: 100vh;
  padding: 1% 7.5% 1%;
}
</style>
