import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import VueCookies from "vue-cookies";
import { routes } from "./constants/routes.ts";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(autoAnimatePlugin);
app.use(router);
app.use(VueCookies);

app.mount("#app");
