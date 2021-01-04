<template>
  <section id="wrapper">
    <q-toolbar class="list-toolbar">
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
      <q-item
        v-for="contact in contacts"
        :key="contact.id"
        class="q-my-sm"
        clickable
        v-ripple
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
  }
];

export default {
  data() {
    return {
      contacts,
      isLoading: false
    };
  },

  methods: {
    doSearch() {
      this.isLoading = true;
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
  overflow-y: auto;
}
.list-toolbar {
  color: #b1b3b5;
  background: #323739;
  border-right: 1px solid #f1f1f21c;
}
</style>
