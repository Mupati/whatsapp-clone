<template>
  <main>
    <AuthApp v-if="isLoggedIn" />
    <NonAuthApp v-else />
  </main>
</template>

<script>
import AuthApp from "./components/AuthApp";
import NonAuthApp from "./components/NonAuthApp";

import { getToken } from "./api";
export default {
  name: "MainApp",
  components: {
    AuthApp,
    NonAuthApp
  },
  data() {
    return {};
  },

  methods: {},

  computed: {
    isLoggedIn() {
      return !!getToken();
    }
  },

  mounted() {
    document.title = "Wossop - Kofi Mupati";
  }
};
</script>

<style lang="scss" scoped>
main {
  // background: #090e11;
  box-sizing: border-box;
  height: 100vh;
  padding: 1% 7.5% 0;
}
</style>
