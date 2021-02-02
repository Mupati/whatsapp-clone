import Vue from "vue";

import "./styles/quasar.scss";
import "quasar/dist/quasar.ie.polyfills";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import { Quasar, Notify } from "quasar";

Vue.use(Quasar, {
  config: {},
  plugins: {
    Notify
  }
});
