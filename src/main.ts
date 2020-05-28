import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 406) {
      store.commit("changeAuth", false);
      store.commit("changeUserId", "");
      store.commit("changeConfirmUser", false);
      router.push({ name: "Auth" }).then();
    }
    return Promise.reject(error.response);
  }
);

(async () => {
  try {
    const { data } = await axios.get("/api/auth/info");

    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      "XSRF-TOKEN": data.token,
      "X-Requested-With": "XMLHttpRequest",
    };
    axios.defaults.baseURL = "/api";
    store.commit("changeAuth", data.isAuth);
    store.commit("changeUserId", data.userId);
  } catch (e) {
    console.log(e);
  } finally {
    new Vue({
      store,
      router,
      render: (h) => h(App),
    }).$mount("#app");
  }
})();
