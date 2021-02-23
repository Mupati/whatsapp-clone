<template>
  <section id="wrapper" class="row items-center justify-center">
    <div class="cropper-container">
      <q-toolbar class="cropper-container__top">
        <q-btn flat round dense icon="close" @click="close" />
        <q-toolbar-title>Drag the image to adjust</q-toolbar-title>
        <q-btn flat no-caps @click="selectNewImage">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="currentColor"
              d="M19.77 11.73c0 1.64-.5 2.95-1.48 3.89-1.38 1.32-3.26 1.41-3.75 1.41H9.01v-2.1h5.46c.05 0 1.47.04 2.38-.84.55-.53.82-1.32.82-2.37 0-1.27-.33-2.23-.99-2.84-.98-.92-2.43-.85-2.44-.85h-4.23v3.1L4 7.07 10.01 3v2.93h4.16c.03 0 2.29-.13 3.95 1.42 1.09 1.03 1.65 2.5 1.65 4.38z"
            ></path>
          </svg>
          &nbsp; Upload
        </q-btn>
      </q-toolbar>
      <Cropper
        ref="cropper"
        class="cropper"
        :src="image"
        image-class="image-class"
        stencil-component="circle-stencil"
        :stencil-props="{
          handlers: {},
          movable: false,
          scalable: false,
          aspectRatio: 1,
          lines: {
            north: false,
            west: false,
            south: false,
            east: false
          }
        }"
        :stencil-size="{
          width: 350,
          height: 350
        }"
        :resize-image="{
          adjustStencil: false
        }"
        image-restriction="stencil"
      ></Cropper>

      <!-- Zoom Controls -->
      <q-btn-group class="column zoom-controls">
        <q-btn size="sm" flat dense icon="add" @click="zoom(1.5)"></q-btn>
        <q-btn size="sm" flat dense icon="remove" @click="zoom(0.6)"></q-btn>
      </q-btn-group>

      <!-- Finish Cropping button -->
      <q-btn
        flat
        fab
        size="20px"
        icon="check"
        class="complete-btn"
        @click="finishCropping"
      ></q-btn>
    </div>
  </section>
</template>

<script>
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "DpEditCanvas",
  props: ["image"],
  components: {
    Cropper,
    // eslint-disable-next-line
    CircleStencil
  },

  data() {
    return {
      // img: "https://wossop-dps.s3.amazonaws.com/user_avatar/mupati_7_dp.jpg"
    };
  },

  methods: {
    // Image manipulation methods
    zoom(factor) {
      this.$refs.cropper.zoom(factor);
    },
    // Get the cropped section, emit to the parent component and upload
    finishCropping() {
      const { canvas } = this.$refs.cropper.getResult();
      if (canvas) {
        this.$emit("uploadCroppedPhoto", canvas);
      }
    },
    close() {
      this.$emit("close");
    },
    selectNewImage() {
      this.$emit("selectNewImage");
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
// .image-class {
//   width: 300px;
//   height: 200px;
// }
.cropper-container {
  position: relative;
  height: 500px;
  width: 500px;
  background: #323739;
  color: #fff;

  .cropper {
    height: 400px;
  }

  .complete-btn {
    position: absolute;
    bottom: 30px;
    right: 30px;
    background: #55b09d;
  }

  .zoom-controls {
    position: absolute;
    bottom: 250px;
    right: 3px;
    color: #fff;
    background: #323739;
  }
}
</style>
