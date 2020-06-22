import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import VueRouter from "vue-router";
import Navigation from "@/components/Navigation.vue";
import { routes } from "@/router";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe("Navigation.vue", () => {
  let store;
  let router;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        isAuth: false,
        userId: "",
        confirmUser: true,
      },
    });
    router = new VueRouter({
      mode: "history",
      base: process.env.BASE_URL,
      routes,
    });
  });

  it("is login", () => {
    store.state.isAuth = true;
    const wrapper = shallowMount(Navigation, { store, router, localVue });
    expect(wrapper.contains('[data-info="out"]')).toBeTruthy();
    expect(wrapper.contains('[data-info="enter"]')).not.toBeTruthy();
  });

  it("is no login", () => {
    const wrapper = shallowMount(Navigation, { store, router, localVue });
    expect(wrapper.contains('[data-info="out"]')).toBeFalsy();
    wrapper.find('[data-info="enter"]').trigger("click");
    store.state.isAuth = false;
    expect(wrapper.contains('[data-info="out"]')).toBeFalsy();
    expect(window.location.pathname).toEqual("/");
  });
});
