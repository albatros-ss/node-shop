<template>
  <div class="course">
    <h1 data-test="title">{{ course.title }}</h1>
    <img :src="course.img" :alt="course.title" />
    <p class="price big">{{ toCurrency }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

type CourseType = {
  title: string;
  price: number;
  img: string;
  _id?: string;
};

@Component
export default class Add extends Vue {
  course: CourseType = {
    title: "",
    img: "",
    price: NaN,
  };

  get toCurrency(): string {
    return new Intl.NumberFormat("uk-UA", {
      currency: "uah",
      style: "currency",
    }).format(this.course.price);
  }

  async created(): Promise<void> {
    try {
      const { data } = await this.$http.get("/course/" + this.$route.params.id);
      this.course = data.course;
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
.course {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100vh - 64px);
  h1 {
    margin-bottom: 2rem;
  }
  img {
    max-width: 600px;
    height: auto;
  }
  .price.big {
    font-size: 2.5rem;
  }
  .price {
    font-size: 2rem;
  }
}
</style>
