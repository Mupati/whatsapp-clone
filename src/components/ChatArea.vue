<template>
  <section id="wrapper">
    <q-toolbar
      class="chat-area-toolbar cursor-pointer"
      @click="selectMenu('user-profile')"
    >
      <q-avatar
        class="q-ml-sm cursor-pointer"
        color="primary"
        text-color="white"
      >
        <img
          :src="userInfo.avatar_url"
          alt="user-dp"
          v-if="userInfo.avatar_url"
        />
        <span v-else> {{ userInfo.name | userAvatar }}</span>
      </q-avatar>
      <q-item>
        <q-item-section>
          <q-item-label class="text-subtitle1" style="color: #fff">{{
            userInfo.name
          }}</q-item-label>
          <q-item-label caption class="text-primary">{{
            userInfo.isTyping ? "typing..." : onlineStatus
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-space />
      <q-btn flat round dense icon="videocam" class="z-top" />
      <q-btn flat round dense icon="call" class="q-ml-md q-mr-xl" />

      <q-btn flat round dense icon="search" />
      <div class="q-mr-md"></div>
      <q-btn
        flat
        round
        dense
        icon="more_vert"
        @click.stop="isShowingChatMenu = true"
      />
    </q-toolbar>

    <div>
      <q-menu
        anchor="bottom right"
        self="top end"
        :offset="[-28, -17]"
        :content-class="['no-border-radius']"
        :content-style="{ 'background-color': '#2a2f32', width: '200px' }"
        v-model="isShowingChatMenu"
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
    </div>

    <div class="messaging-area row justify-center">
      <q-scroll-area
        style="width: 100%"
        class="messaging-area__chat q-px-xl q-py-md"
        ref="chatScroll"
      >
        <div v-for="message in messages" :key="message.id">
          <q-chat-message
            :text="[`${message.message}`]"
            :stamp="messageTime(message.created_at)"
            sent
            v-if="message.sender === authUserId"
          >
          </q-chat-message>

          <q-chat-message
            :text="[`${message.message}`]"
            :stamp="messageTime(message.created_at)"
            v-if="message.receiver === authUserId"
          ></q-chat-message>
        </div>
        <q-spinner-dots size="2rem" color="positive" v-if="userInfo.isTyping" />
      </q-scroll-area>
    </div>
    <div class="messaging-input q-px-md q-pt-sm">
      <q-input
        rounded
        dense
        standout
        autogrow
        placeholder="Type a message"
        :input-style="{
          'padding-right': '20px',
          color: '#f1f1f2'
        }"
        bg-color="dark"
        v-model="new_message"
        @keyup="userTyping"
        @keyup.enter="sendMessage"
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
            v-if="new_message"
            style="color: #b1b3b5"
            @click="sendMessage"
          />
          <q-btn flat round dense icon="mic" v-else style="color: #b1b3b5" />
        </template>
      </q-input>
    </div>
  </section>
</template>

<script>
import { Api, getToken } from "../api";
import { getMessageTime } from "../api/utils";
export default {
  props: [
    "userInfo",
    "onlineStatus",
    "allMessages",
    "messagingChannel",
    "authUserId"
  ],
  data() {
    return {
      new_message: null,
      isShowingChatMenu: false
    };
  },
  computed: {
    messages() {
      return this.allMessages;
    }
  },

  filters: {
    // It can be moved later to a global level
    // the Avatar itself can be extracted into a component on it's own when refactoring
    userAvatar(name) {
      return name
        .trim()
        .charAt(0)
        .toUpperCase();
    }
  },
  methods: {
    messageTime(datetime) {
      return getMessageTime(datetime);
    },

    scrollToChatBottom() {
      const scrollArea = this.$refs.chatScroll;
      const scrollTarget = scrollArea.getScrollTarget();
      const duration = 300;
      scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration);
    },
    selectMenu(itemName) {
      this.$emit("handleRightNavigation", itemName);
    },

    async sendMessage() {
      Api.post(
        "/message",
        { receiver_id: this.userInfo.id, message: this.new_message.trim() },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )
        .then(() => {
          this.new_message = null;
          this.scrollToChatBottom();
        })
        .catch(err => {
          console.log(err);
        });
    },

    userTyping() {
      setTimeout(() => {
        this.messagingChannel.whisper("typing", {
          sender: this.authUserId,
          receiver: this.userInfo.id
        });
      }, 1000);
    },

    listenForNewMessages() {
      // Listen to incoming Wossop Messages
      this.messagingChannel.listen("SendWossopMessage", ({ message }) => {
        if (
          (message.sender === this.authUserId &&
            message.receiver === this.userInfo.id) ||
          (message.receiver === this.authUserId &&
            message.sender === this.userInfo.id)
        ) {
          this.messages.push(message);
        }
      });
    },

    initializePrivateChatChannel() {
      window.Echo.private(`private-chat-channel.${this.authUserId}`).listen(
        "SendPrivateWossopMessage",
        ({ message }) => {
          this.messages.push(message);
        }
      );
    }
  },

  mounted() {
    this.scrollToChatBottom();
    // this.listenForNewMessages();
    this.initializePrivateChatChannel();
  },

  updated() {
    // when a new user is selected from the chat list
    // scroll to the bottom
    this.scrollToChatBottom();
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
  // mix-blend-mode: multiply;

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
