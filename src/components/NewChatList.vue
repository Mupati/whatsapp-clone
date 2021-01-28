<template>
  <section id="wrapper">
    <div class="list-toolbar">
      <q-toolbar></q-toolbar>
      <q-toolbar class="list-toolbar">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="$emit('handleLeftNavigation')"
        />
        <q-toolbar-title>New chat</q-toolbar-title>
      </q-toolbar>
    </div>

    <q-list bordered separator>
      <q-item>
        <q-item-section>
          <q-input
            rounded
            dense
            standout
            placeholder="Search contacts"
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

    <q-scroll-area style="height: calc(100% - 170px)">
      <q-list bordered separator>
        <q-item class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar
              color="positive"
              text-color="white"
              size="48px"
              font-size="32px"
            >
              <q-icon name="group_add" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-white text-h6">New group</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="contact in allUsers"
          :key="contact.id"
          class="q-my-sm"
          clickable
          v-ripple
          @click="selectUser(contact.id)"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="48px">
              <img
                :src="contact.avatar_url"
                alt="user-dp"
                v-if="contact.avatar_url"
              />
              <span v-else> {{ contact.name | userAvatar }}</span>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-white">{{ contact.name }}</q-item-label>
            <q-item-label class="text-grey" caption lines="1"
              >About the user</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </section>
</template>

<script>
import { getUsers } from "../api";
export default {
  name: "NewChatList",
  // props: ["users"],
  data() {
    return {
      isLoading: false,
      allUsers: null
    };
  },

  filters: {
    userAvatar(name) {
      return name
        .trim()
        .charAt(0)
        .toUpperCase();
    }
  },
  methods: {
    doSearch() {
      this.isLoading = true;
    },

    selectUser(userId) {
      let selectedUserInfo =
        this.allUsers && this.allUsers.filter(user => user.id === userId);
      this.$emit("selectUser", selectedUserInfo[0]);
    },

    fetchAllUsers() {
      return getUsers()
        .then(res => {
          this.allUsers = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  mounted() {
    this.fetchAllUsers();
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
}
</style>
