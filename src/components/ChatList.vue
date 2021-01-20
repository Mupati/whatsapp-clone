<template>
  <section id="wrapper">
    <q-toolbar class="list-toolbar" style="height: 64.2812px">
      <q-avatar class="q-ml-sm cursor-pointer" @click="selectMenu('profile')">
        <img src="../assets/default_avatar.png" />
      </q-avatar>
      <q-space />
      <q-btn flat round dense icon="donut_large" />
      <div class="q-ml-sm"></div>
      <q-btn flat round dense icon="chat" />
      <div class="q-mr-sm"></div>
      <q-btn flat round dense icon="more_vert">
        <q-menu
          :offset="[180, 0]"
          :content-class="['no-border-radius']"
          :content-style="{ 'background-color': '#2a2f32', width: '200px' }"
        >
          <q-list style="color: #d4d5d7">
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>New group</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Create a room</q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="q-pl-lg"
              @click="selectMenu('profile')"
            >
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Archived</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Starred</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg" @click="logoutUser">
              <q-item-section>Log out</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-list bordered separator>
      <q-item>
        <q-item-section>
          <q-input
            rounded
            dense
            standout
            placeholder="Search or start a new chat"
            :loading="isLoading"
            :input-style="{
              'padding-right': '20px',
              color: '#f1f1f2'
            }"
            bg-color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="search" style="color: #b1b3b5" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-list>

    <q-scroll-area style="height: calc(100% - 122.2656px)">
      <q-list bordered separator>
        <q-item
          v-for="contact in allUsers"
          :key="contact.id"
          class="q-my-sm"
          clickable
          v-ripple
          @click="selectUser(contact.id)"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white"> K </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-white">{{ contact.name }}</q-item-label>
            <q-item-label class="text-grey" caption lines="1">{{
              contact.latest_message.length > 0
                ? contact.latest_message[0].message
                : contact.email
            }}</q-item-label>
          </q-item-section>

          <q-item-section side v-if="contact.latest_message.length > 0">
            <q-item-label>{{
              messageTime(contact.latest_message[0].created_at)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </section>
</template>

<script>
import { doLogout } from "../api";
import { getMessageTime } from "../api/utils";

export default {
  name: "ChatList",
  props: ["users"],
  data() {
    return {
      isLoading: false,
      allUsers: this.users
    };
  },

  methods: {
    doSearch() {
      this.isLoading = true;
    },

    selectMenu(itemName) {
      this.$emit("handleLeftNavigation", itemName);
    },

    selectUser(userId) {
      let selectedUserInfo = this.allUsers.filter(user => user.id === userId);
      this.$emit("selectUser", selectedUserInfo[0]);
    },
    messageTime(datetime) {
      return getMessageTime(datetime);
    },
    async logoutUser() {
      try {
        await doLogout();
        this.$root.$emit("logoutUser");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#wrapper {
  height: 100%;
  background-color: #131c21;
  border-right: 1px solid #f1f1f21f;
  overflow-x: hidden;
}
.list-toolbar {
  color: #b1b3b5;
  background: #323739;
  border-right: 1px solid #f1f1f21c;
}
</style>
