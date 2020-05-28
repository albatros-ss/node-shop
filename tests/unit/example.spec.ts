import { shallowMount } from "@vue/test-utils";
import Navigation from "@/components/Navigation.vue";

describe("Navigation.vue", () => {
  it("test", () => {
    const isAuth = "";
    const wrapper = shallowMount(Navigation, {
      propsData: { isAuth },
    });
    expect(wrapper.text()).toMatch(isAuth);
  });
});
