<template>
  <section id="wrapper">
    <div class="profile-toolbar">
      <q-toolbar></q-toolbar>
      <q-toolbar class="profile-toolbar">
        <q-btn flat round dense icon="arrow_back" @click="navigateBack" />
        <q-toolbar-title>Profile</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- Your Name -->
    <q-card flat bordered class="card-bg">
      <q-card-section class="q-pt-none">
        <div class="dp-container relative-position q-mt-md q-mb-xl q-mx-auto">
          <q-avatar
            style="width: 200px; height: 200px"
            color="primary"
            text-color="white"
            font-size="3em"
          >
            <img
              :src="user.avatar_url"
              alt="user-dp"
              height="200"
              width="200"
              style="border-radius: 50%"
              class="block cursor-pointer user-dp"
              v-if="user.avatar_url"
            />
            <span v-else> {{ user.name | userAvatar }}</span>
            <q-file
              v-model="newDp"
              label="Standard"
              style="display: none"
              ref="uploadDialog"
              accept=".jpg, image/*"
              @input="editNewDp"
            />
            <!-- @input="uploadPhoto" -->
          </q-avatar>
          <div
            class="column justify-center items-center absolute dp-change text-center cursor-pointer"
            :class="{ 'show-opacity': isActiveChangeDp }"
          >
            <q-menu
              anchor="center right"
              self="top middle"
              @before-show="isActiveChangeDp = true"
              @before-hide="isActiveChangeDp = false"
            >
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  class="q-pl-lg"
                  @click="isVisibleDpModal = true"
                >
                  <q-item-section>View photo</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  class="q-pl-lg"
                  @click="takePhoto"
                >
                  <q-item-section>Take photo</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  class="q-pl-lg"
                  @click="showUploadDialog"
                >
                  <q-item-section>Upload photo</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  class="q-pl-lg"
                  @click="removePhoto"
                >
                  <q-item-section>Remove photo</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-btn flat round dense icon="photo_camera" class="q-mb-sm"></q-btn>
            <div>
              CHANGE<br />
              PROFILE<br />
              PHOTO
            </div>
          </div>
        </div>
        <div class="text-subtitle2">Your Name</div>
        <div class="text-subtitle1">{{ user.name | capitalize }}</div>
      </q-card-section>
    </q-card>

    <!-- About -->
    <q-card flat bordered class="card-bg q-my-xs">
      <q-card-section>
        This is not your username or pin. This name will be visible to your
        WhatsApp contacts.
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">About</div>
        <div class="text-subtitle1 cursor-pointer">
          {{ user.about ? user.about : "Hi, there I use Wossop" }}
          <q-popup-edit v-model="user.about" @save="updateAboutInfo">
            <q-input
              v-model="user.about"
              dense
              autofocus
              counter
              color="dark"
            />
          </q-popup-edit>
        </div>
      </q-card-section>
    </q-card>

    <!-- Fullscreen modal for editing display picture before uploading -->
    <DpEditCanvas
      v-if="isVisibleEditCanvas"
      :image="base64Dp"
      @close="isVisibleEditCanvas = false"
      @selectNewImage="selectNewImage"
      @uploadCroppedPhoto="uploadCroppedPhoto"
    />

    <!-- Fullscreen modal for viewing Display Picture -->
    <DpViewingModal
      v-if="isVisibleDpModal"
      :image="user.avatar_url"
      :name="user.name"
      @close="isVisibleDpModal = false"
    />
  </section>
</template>

<script>
import { Api, getToken } from "../api";
export default {
  name: "AuthUserProfile",
  props: ["authUser"],
  components: {
    DpViewingModal: () => import("./DpViewingModal"),
    DpEditCanvas: () => import("./DpEditCanvas")
  },
  data() {
    return {
      isMutedNotification: false,
      isActiveChangeDp: false,
      newDp: null,
      base64Dp: null,
      isVisibleDpModal: false,
      isVisibleEditCanvas: false
    };
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

  computed: {
    user() {
      return this.authUser;
    }
  },
  methods: {
    navigateBack() {
      this.$emit("handleLeftNavigation");
    },

    takePhoto() {
      console.log("take photo");
    },

    showUploadDialog() {
      this.$refs.uploadDialog.pickFiles();
    },

    image2base64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    async editNewDp() {
      this.base64Dp = await this.image2base64(this.newDp);
      this.isVisibleEditCanvas = true;
    },

    selectNewImage() {
      this.isVisibleEditCanvas = false;
      this.showUploadDialog();
    },

    updateAboutInfo(newAbout) {
      Api.post(
        "/update-info",
        {
          field: "about",
          value: newAbout
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          }
        }
      )
        .then(() => {
          this.$root.$emit("updateProfile");
          this.$q.notify({
            type: "positive",
            message: "About updated",
            position: "bottom-left"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    uploadCroppedPhoto(canvas) {
      this.isVisibleEditCanvas = false;
      const fd = new FormData();

      canvas.toBlob(blob => {
        fd.append("id", this.user.id);
        fd.append("image", blob);

        const self = this;
        Api.post("/update-dp", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`
          }
        })
          .then(() => {
            // emit event to fetch user data again on the AuthApp
            self.$root.$emit("updateProfile");
            self.$q.notify({
              type: "positive",
              message: "Display picture updated",
              position: "bottom-left"
            });
          })
          .catch(err => {
            console.log(err);
          });
      }, "image/jpeg");
    },

    uploadPhoto() {
      const fd = new FormData();

      fd.append("id", this.user.id);
      fd.append("image", this.newDp);

      Api.post("/update-dp", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`
        }
      })
        .then(res => {
          console.log(res);
          // emit event to fetch user data again on the AuthApp
          this.$root.$emit("updateProfile");
          this.$q.notify({
            type: "positive",
            message: "Display picture updated",
            position: "bottom-left"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    removePhoto() {
      console.log("upload photo");
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  border-left: 1px solid #f1f1f21f;
  background-color: #0d1418;
}
.profile-toolbar {
  color: #b1b3b5;
  background: #323739;
  border-left: 1px solid #f1f1f21c;
}
.card-bg {
  background-color: #131c21;
}

.dp-container {
  height: 200px;
  width: 200px;
}

.user-dp {
  opacity: 1;
  &:hover {
    opacity: 0.3;
    backface-visibility: hidden;
  }
}
.dp-change {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: #232b2fcc;
  color: #fff;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
}
.show-opacity {
  opacity: 1;
}
</style>
