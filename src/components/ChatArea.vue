<template>
  <section id="wrapper">
    <q-toolbar class="chat-area-toolbar">
      <q-avatar class="q-ml-sm">
        <img src="../assets/default_avatar.png" />
      </q-avatar>
      <q-toolbar-title></q-toolbar-title>

      <q-btn flat round dense icon="search" />
      <div class="q-mr-md"></div>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <div class="messaging-area q-pa-md row justify-center">
      <div style="width: 100%" class="messaging-area__chat">
        <q-chat-message :text="['hey, how are you?']" sent />
        <q-chat-message :text="['doing fine, how r you?']" />
      </div>
    </div>
    <div class="messaging-input q-px-md">
      <q-input
        rounded
        standout
        dense
        filled
        placeholder="Type a message"
        class="text-primary"
        v-model="message"
      >
        <template v-slot:before>
          <q-btn flat round dense icon="sentiment_satisfied_alt" />
          <q-btn flat round dense icon="attach_file" />
        </template>
        <template v-slot:after>
          <q-btn flat round dense icon="send" v-if="message" />
          <q-btn flat round dense icon="mic" v-else />
        </template>
      </q-input>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      message: null
    };
  }
};
</script>

<style lang="scss" scoped>
@mixin generic-bg {
  color: #b1b3b5;
  background: #323739;
}
#wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-area-toolbar {
  @include generic-bg;
  flex-grow: 1;
}
.messaging-area {
  flex-grow: 60;
  background-color: #131c21;
  background-image: url("../assets/chat-area-bg.png");
  //   mix-blend-mode: multiply;

  &__chat {
    isolation: isolate;
  }
}

.messaging-input {
  @include generic-bg;
  flex-grow: 1;
  align-items: center;
}
</style>
