import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/MapView.vue";
import CrimeDataPage from "../pages/CrimeDataPage.vue"; // Import the new CrimeDataPage component

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/crimes",
    name: "CrimeDataPage",
    component: CrimeDataPage, // Add the new CrimeDataPage component
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
