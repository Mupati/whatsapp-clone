<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <HelloWorld msg="The Bare Necessities of Life" />
    </q-page-container>
  </q-layout>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "LayoutDefault",

  components: {
    HelloWorld,
  },

  data() {
    return {
      leftDrawerOpen: false,
    };
  },
};
</script>

<style></style>
