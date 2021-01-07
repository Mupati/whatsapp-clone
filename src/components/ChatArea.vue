<template>
  <section id="wrapper">
    <q-toolbar
      class="chat-area-toolbar cursor-pointer"
      @click="selectMenu('user-profile')"
    >
      <q-avatar class="q-ml-sm cursor-pointer">
        <img src="../assets/default_avatar.png" />
      </q-avatar>
      <q-item>
        <q-item-section>
          <q-item-label class="text-subtitle1" style="color: #fff"
            >Bra Medo</q-item-label
          >
          <q-item-label caption class="text-primary"
            >Last seen today at 10:18PM</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-space />
      <q-btn flat round dense icon="videocam" class="z-top" />
      <q-btn flat round dense icon="call" class="q-ml-md q-mr-xl" />

      <q-btn flat round dense icon="search" />
      <div class="q-mr-md"></div>
      <q-btn flat round dense icon="more_vert">
        <q-menu
          :offset="[180, 0]"
          :content-class="['no-border-radius']"
          :content-style="{ 'background-color': '#2a2f32', width: '200px' }"
          no-parent-event
        >
          <q-list style="color: #d4d5d7">
            <q-item
              clickable
              v-close-popup
              class="q-pl-lg"
              @click="selectMenu('user-profile')"
            >
              <q-item-section>Contact info</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Select messages</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Mute notifications</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Clear messages</q-item-section>
            </q-item>
            <q-item clickable v-close-popup class="q-pl-lg">
              <q-item-section>Delete chat</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <div class="messaging-area row justify-center">
      <q-scroll-area
        style="width: 100%"
        class="messaging-area__chat q-px-xl q-py-md"
      >
        <div v-for="i in 20" :key="i">
          <q-chat-message :text="['hey, how are you?']" sent />
          <q-chat-message :text="['doing fine, how r you?']" />
        </div>
      </q-scroll-area>
    </div>
    <div class="messaging-input q-px-md q-pt-sm">
      <q-input
        rounded
        dense
        standout
        hide-bottom-space
        placeholder="Type a message"
        :input-style="{
          'padding-right': '20px',
          color: '#f1f1f2'
        }"
        bg-color="dark"
        v-model="message"
      >
        <template v-slot:before>
          <q-btn
            flat
            round
            dense
            icon="sentiment_satisfied_alt"
            style="color: #b1b3b5"
          />
          <q-fab
            icon="attach_file"
            direction="up"
            flat
            unelevated
            padding="5px"
            style="color: #b1b3b5"
          >
            <q-fab-action
              color="accent"
              glossy
              text-color="white"
              icon="image"
            />
            <q-fab-action
              color="positive"
              text-color="white"
              icon="camera_alt"
            />
            <q-fab-action
              color="amber"
              text-color="white"
              icon="insert_drive_file"
            />
            <q-fab-action color="negative" text-color="white" icon="contacts" />
            <q-fab-action color="info" text-color="white" icon="video_call" />
          </q-fab>
        </template>
        <template v-slot:after>
          <q-btn
            flat
            round
            dense
            icon="send"
            v-if="message"
            style="color: #b1b3b5"
          />
          <q-btn flat round dense icon="mic" v-else style="color: #b1b3b5" />
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
  },

  methods: {
    selectMenu(itemName) {
      this.$emit("handleRightNavigation", itemName);
    }
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
  color: #b1b3b5;
  background-color: #1e2428;
  flex-grow: 1;
  align-items: center;
}

.chat-input {
  padding-left: 20px;
  // border-radius: 30px;
  color: #b1b3b5;
  background-color: blue;
}
</style>
