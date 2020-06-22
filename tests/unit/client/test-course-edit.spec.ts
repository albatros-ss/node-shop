import { createLocalVue, shallowMount } from "@vue/test-utils";
import axios from "axios";
import CourseEdit from "@/views/CourseEdit.vue";
import Vuex from "vuex";
import VueAxios from "vue-axios";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueAxios, axios);

jest.mock("axios", () => ({
  delete: jest.fn(() => Promise.resolve({ data: 3 })),
}));

describe("CourseEdit.vue", () => {
  it("check info course edit", async () => {
    const store = new Vuex.Store({
      state: {
        isAuth: false,
        userId: "",
        confirmUser: true,
      },
    });
    const getInfo = jest.fn();
    const wrapper = shallowMount(CourseEdit, {
      store,
      localVue,
      mocks: {
        $route: {
          params: {
            id: "5ecd2a9212643f24da213167",
          },
        },
      },
      methods: {
        getInfo,
      },
    });

    expect(getInfo).toBeCalled();

    await wrapper.find('[data-test="remove"]').trigger("click");

    expect(axios.delete).toBeCalledWith(
      "/course/remove/5ecd2a9212643f24da213167"
    );
  });
});
