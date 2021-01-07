<template>
  <div class="wrapper full-height column justify-center q-mx-auto">
    <div class="text-h3 text-center q-mb-md">WOSSOP</div>
    <q-btn-toggle
      v-model="signUpMode"
      spread
      rounded
      no-caps
      toggle-color="blue"
      color="white"
      text-color="black"
      class="full-width"
      style="border-radius: 5px 5px 0px 0px !important"
      :options="[
        { label: 'LOG IN', value: 'login' },
        { label: 'REGISTER', value: 'register' }
      ]"
    />
    <q-form @submit="submitForm">
      <q-card class="q-pa-xl" flat bordered no-border-radius>
        <div class="row q-mb-md" v-if="signUpMode === 'register'">
          <q-input
            square
            dense
            outlined
            type="text"
            required
            v-model="name"
            class="full-width"
            label="Username"
          />
        </div>

        <div class="row q-mb-md">
          <q-input
            square
            dense
            outlined
            required
            type="email"
            v-model="email"
            class="full-width"
            label="Email"
          />
        </div>

        <div class="row q-mb-md">
          <q-input
            square
            dense
            outlined
            v-model="password"
            class="full-width"
            label="Password"
            type="password"
          />
        </div>
        <div class="row q-mb-md" v-if="signUpMode === 'register'">
          <q-input
            square
            dense
            outlined
            required
            v-model="password_confirmation"
            class="full-width"
            label="Confirm Password"
            type="password"
          />
        </div>
        <div class="row q-mb-md">
          <q-btn
            type="submit"
            no-caps
            style="background-color: #27ae60"
            class="full-width text-white"
            :label="signUpMode === 'login' ? 'LOG IN' : 'CREATE YOUR ACCOUNT'"
          />
        </div>
        <p class="caption text-positive" v-if="registerSuccess">
          Proceed to Login
        </p>
      </q-card>
    </q-form>
  </div>
</template>

<script>
import { doLogin, doRegister, storeToken } from "../api";
export default {
  name: "NonAuthApp",
  data() {
    return {
      signUpMode: "login",
      name: null,
      email: null,
      password: null,
      password_confirmation: null,
      registerSuccess: false
    };
  },

  methods: {
    submitForm() {
      if (this.signUpMode === "register") {
        this.registerUser();
      } else {
        this.logInUser();
      }
    },

    async logInUser() {
      try {
        const data = {
          email: this.email,
          password: this.password
        };
        const res = await doLogin(data);
        storeToken(res.data.token);
        this.$root.$emit("loginUser");
      } catch (error) {
        console.log(error.response.data);
      }
    },

    async registerUser() {
      try {
        const data = {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        };
        const response = await doRegister(data);
        console.log(response);
        this.registerSuccess = true;
      } catch (error) {
        console.log(error.response.data.errors);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  color: #333;
  max-width: 600px;
  background-image: url("../assets/chat-area-bg.png");
}
</style>
