<template>
  <q-list>
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
        <q-item-label>{{ contact.name }}</q-item-label>
        <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chat_bubble" color="green" />
      </q-item-section>
    </q-item>
  </q-list>
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
      contacts
    };
  }
};
</script>
<style lang="scss" scoped></style>
