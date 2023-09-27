import "@/styles/reset.scss";
import "@/styles/common.scss";
import "@/styles/fonts.scss";
import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/stores";
import "vant/lib/index.css";
import vconsole from "vconsole";
new vconsole();

createApp(App).use(router).use(store).mount("#app");
