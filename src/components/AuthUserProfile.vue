<template>
  <section id="wrapper">
    <div class="profile-toolbar">
      <q-toolbar></q-toolbar>
      <q-toolbar class="profile-toolbar">
        <q-btn flat round dense icon="arrow_back" @click="showChatList" />
        <q-toolbar-title>Profile</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- Your Name -->
    <q-card flat bordered class="card-bg">
      <q-card-section class="q-pt-none q-mx-auto">
        <img
          src="../assets/default_avatar.png"
          alt="display picture"
          height="200"
          width="200"
          style="border-radius: 50%"
          class="block q-mx-auto q-mt-md q-mb-xl"
        />
        <div class="text-subtitle2">Your Name</div>
        <div class="text-subtitle1">Bra Krox Effectx</div>
      </q-card-section>
    </q-card>

    <!-- About -->
    <q-card flat bordered class="card-bg q-my-xs">
      <q-card-section>
        This is not your username or pin. This name will be visible to your
        WhatsApp contacts.
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">Your Name</div>
        <div class="text-subtitle1">
          My Confidence is in the Mercy of God. 01.01.21
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isMutedNotification: false
    };
  },

  methods: {
    showChatList() {
      this.$emit("showChatList");
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
}
</style>
