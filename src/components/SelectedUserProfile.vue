<template>
  <section id="wrapper">
    <q-toolbar class="profile-toolbar" style="height: 64.2812px">
      <q-btn flat round dense icon="close" @click="hideRightSection" />
      <q-toolbar-title>Contact info</q-toolbar-title>
    </q-toolbar>

    <!-- About - Image and Last seen -->
    <q-card flat bordered class="card-bg">
      <q-card-section class="q-pt-none q-mx-auto">
        <img
          src="../assets/default_avatar.png"
          alt="display picture"
          height="200"
          width="200"
          style="border-radius: 50%"
          class="block q-mx-auto q-mt-md"
        />
        <div class="text-h6">{{ userInfo.name }}</div>
        <div class="text-subtitle2">Last seen today at 10:30PM</div>
      </q-card-section>
    </q-card>

    <!-- Media, Links and Docs -->
    <q-card flat bordered class="card-bg">
      <q-card-section>
        <p>Media, Links and Docs</p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </q-card-section>
    </q-card>

    <q-card class="card-bg">
      <q-card-section class="q-px-none">
        <q-list separator class="q-px-none">
          <q-item class="q-px-none">
            <q-item-section>Mute notifications</q-item-section>
            <q-item-section class="text-right">
              <q-checkbox v-model="isMutedNotification" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Starred Messages</q-item-section>
            <q-item-section></q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Disappearing Messages</q-item-label>
              <q-item-label>Off</q-item-label>
            </q-item-section>
            <q-item-section></q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>
export default {
  name: "SelectedUserProfile",
  props: ["userInfo"],
  data() {
    return {
      isMutedNotification: false
    };
  },
  methods: {
    hideRightSection() {
      this.$emit("hideRightSection");
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  border-left: 1px solid #f1f1f21f;
  background-color: #0d1418;
}
.profile-toolbar {
  color: #b1b3b5;
  background: #323739;
  border-left: 1px solid #f1f1f21c;
}
.card-bg {
  background-color: #131c21;
  margin-bottom: 10px;
}
</style>
