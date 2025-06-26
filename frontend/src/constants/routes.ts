import Home from "../pages/Home.vue";
import Auth from "../pages/Auth.vue";
import Registration from "../pages/Registration.vue";
import ShortUrlRedirect from "../pages/ShortUrlRedirect.vue";
import NotFound from "../pages/NotFound.vue";
import Expired from "../pages/Expired.vue";

export const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/auth",
    component: Auth,
  },
  {
    path: "/registration",
    component: Registration,
  },
  {
    path: "/:shortUrl",
    component: ShortUrlRedirect,
  },
  {
    path: "/not-found",
    component: NotFound,
  },
  {
    path: "/expired",
    component: Expired,
  },
];
