import { shallowMount } from "@vue/test-utils";
import Course from "@/views/Course.vue";

describe("Course.vue", () => {
  it("check info course", async () => {
    const wrapper = shallowMount(Course);
    wrapper.setData({
      course: {
        img:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png",
        price: 2000,
        title: "Angular 8",
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="title"]').text()).toBe("Angular 8");
  });
});
