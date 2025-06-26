import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

const app = createApp(App);

const routes = [
  {
    path: "/",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(autoAnimatePlugin);
app.use(router);

app.mount("#app");
