<template>
  <q-page class="flex flex-center">
    <div class="text-h4">{{ msg }}</div>
    <img alt="Quasar logo" src="../assets/logo.png" />
  </q-page>
</template>

<style></style>

<script>
export default {
  name: "HelloWorld",
  props: ["msg"]
};
</script>
