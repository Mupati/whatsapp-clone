<template>
  <q-toolbar class="toolbar-color">
    <q-avatar class="q-ml-sm">
      <img src="../assets/default_avatar.png" />
    </q-avatar>
    <q-toolbar-title></q-toolbar-title>

    <q-btn flat round dense icon="donut_large" />
    <div class="q-ml-sm"></div>
    <q-btn flat round dense icon="chat" />
    <div class="q-mr-sm"></div>
    <q-btn flat round dense icon="more_vert" />
  </q-toolbar>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.toolbar-color {
  color: #b1b3b5;
  background: #323739;
}
</style>
