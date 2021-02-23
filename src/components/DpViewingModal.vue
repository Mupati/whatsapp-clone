<template>
  <section id="wrapper">
    <q-toolbar class="q-py-sm">
      <q-avatar
        class="q-ml-sm cursor-pointer"
        color="primary"
        text-color="white"
      >
        <img :src="image" alt="user-dp" v-if="image" />
        <span v-else> {{ name | userAvatar }}</span>
      </q-avatar>
      <q-item>
        <q-item-section>
          <q-item-label class="text-subtitle1" style="color: #fff">{{
            name | capitalize
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-space />

      <q-btn flat round dense icon="close" @click="closeModal" title="Close" />
    </q-toolbar>

    <div class="body row justify-center items-center">
      <div class="body__img">
        <img :src="image" height="640" width="640" alt="user-dp" v-if="image" />
        <div
          v-else
          class="text-avatar row justify-center items-center bg-primary"
        >
          <span>
            {{ name | userAvatar }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "DpViewingModal",
  props: {
    name: { type: String, required: true },
    image: {
      required: true
    }
  },
  data() {
    return {};
  },

  filters: {
    // It can be moved later to a global level
    // the Avatar itself can be extracted into a component on it's own when refactoring
    userAvatar(name) {
      return name
        .trim()
        .charAt(0)
        .toUpperCase();
    },

    capitalize(name) {
      return name
        .trim()
        .charAt(0)
        .toUpperCase()
        .concat(name.slice(1));
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(18, 28, 33, 0.95);
  z-index: 9999;
}

.body {
  height: calc(100vh - 66px);
  &__img {
    height: 640px;
    width: 640px;

    .text-avatar {
      height: 100%;
      font-size: 20em;
      border-radius: 50%;
    }
  }
}
</style>
