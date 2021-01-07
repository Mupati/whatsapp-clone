<template>
  <section id="wrapper">
    <q-toolbar class="list-toolbar" style="height: 64.2812px">
      <q-avatar
        class="q-ml-sm cursor-pointer"
        @click="selectMenu('profile')"
        itemName
      >
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
            <q-item clickable v-close-popup class="q-pl-lg">
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
            filled
            placeholder="Search or start a new chat"
            style="background-color: #323739; border-radius: 29px"
            class="text-primary"
            :loading="isLoading"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-list>

    <q-scroll-area style="height: calc(100% - 122.2656px)">
      <q-list bordered separator>
        <q-item
          v-for="contact in contacts"
          :key="contact.id"
          class="q-my-sm"
          clickable
          v-ripple
          @click="selectUser(contact.id)"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ contact.letter }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-white">{{ contact.name }}</q-item-label>
            <q-item-label class="text-grey" caption lines="1">{{
              contact.email
            }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>10:51am</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </section>
</template>

<script>
const contacts = [
  {
    id: 1,
    name: "Ruddy Jedrzej",
    email: "rjedrzej0@discuz.net",
    letter: "R"
  },
  {
    id: 2,
    name: "Mallorie Alessandrini",
    email: "malessandrini1@marketwatch.com",
    letter: "M"
  },
  {
    id: 3,
    name: "Elisabetta Wicklen",
    email: "ewicklen2@microsoft.com",
    letter: "E"
  },
  {
    id: 4,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 5,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 6,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 7,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 8,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 9,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 10,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 11,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 12,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  },
  {
    id: 13,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S"
  }
];

export default {
  name: "ChatList",
  props: ["authUser"],
  data() {
    return {
      contacts,
      isLoading: false
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
      this.$emit("selectUser", userId);
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
