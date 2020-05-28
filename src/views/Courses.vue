<template>
  <div>
    <h1>Курсы</h1>
    <p v-if="!courses.length">Курсов пока нет</p>
    <div class="row" v-else v-for="course in courses" :key="course._id">
      <div class="col s6 offset-s3">
        <div class="card">
          <div class="card-image">
            <img :src="course.img" :alt="course.title" />
          </div>
          <div class="card-content">
            <span class="card-title">{{ course.title }}</span>
            <p class="price">{{ toCurrency(course.price) }}</p>
          </div>
          <div class="card-action actions">
            <router-link :to="{ name: 'Course', params: { id: course._id } }">
              Открыть курс
            </router-link>
            <template v-if="$store.state.isAuth">
              <router-link
                :to="{
                  name: 'CourseEdit',
                  params: { id: course._id },
                }"
                target="_blank"
                v-if="course.owner"
              >
                Редактировать
              </router-link>
              <button @click="buyCourse(course._id)" class="btn btn-primary">
                Купить
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

type CourseType = {
  title: string;
  price: number;
  img: string;
  _id: string;
};

type Res = {
  courses: Array<CourseType>;
  isCourses: boolean;
};

@Component
export default class Courses extends Vue {
  courses: Array<CourseType> = [];
  async buyCourse(id: string): Promise<void> {
    try {
      await this.$http.post("/card/add", { id });
      await this.$router.push({ name: "Card" });
    } catch (e) {
      console.log(e);
    }
  }
  async created(): Promise<void> {
    try {
      const response = await this.$http.get("/courses");
      const data: Res = response.data;
      this.courses = data.courses;
    } catch (e) {
      console.log(e);
    }
  }

  toCurrency(price: number): string {
    return new Intl.NumberFormat("uk-UA", {
      currency: "uah",
      style: "currency",
    }).format(price);
  }
}
</script>

<style lang="scss">
.price {
  font-size: 2rem;
}
.card-action.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
