import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: false,
    userId: "",
    confirmUser: true,
  },
  mutations: {
    changeAuth(state, value) {
      state.isAuth = value;
    },
    changeUserId(state, value) {
      state.userId = value;
    },
    changeConfirmUser(state, value) {
      state.userId = value;
    },
  },
  actions: {},
  modules: {},
});
