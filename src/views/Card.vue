<template>
  <div>
    <h1>Корзина</h1>
    <div v-if="courses.length" id="card">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Действия</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course._id">
            <td>{{ course.title }}</td>
            <td>{{ course.count }}</td>
            <td>{{ course.price }}</td>
            <td>
              <button class="btn btm-small" @click="deleteCourse(course)">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>Цена:</strong>
        <span class="price">{{ toCurrency(price) }}</span>
      </p>
      <button class="btn" @click="createOrder">Сделать заказ</button>
    </div>
    <p v-else>Корзина пуста</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

type CourseType = {
  title: string;
  price: number;
  img: string;
  _id: string;
  count: number;
};

type Res = {
  courses: Array<CourseType>;
  isCard: boolean;
};

@Component
export default class Card extends Vue {
  isCard = false;
  courses: Array<CourseType> = [];

  get price(): number {
    return this.courses.reduce((sum: number, course: CourseType) => {
      return sum + course.price * course.count;
    }, 0);
  }

  async created(): Promise<void> {
    try {
      const response = await this.$http.get("/card");
      const data: Res = response.data;
      this.courses = data.courses;
      this.isCard = data.isCard;
    } catch (e) {
      console.log(e);
    }
  }
  async deleteCourse(course: CourseType): Promise<void> {
    try {
      await this.$http.delete("/card/remove/" + course._id);
      this.courses = this.courses.filter((item: CourseType) => {
        if (item._id === course._id) {
          item.count--;
        }
        return item.count;
      });
    } catch (e) {
      console.log(e);
    }
  }
  async createOrder() {
    try {
      await this.$http.post("/orders");
      await this.$router.push({ name: "Orders" });
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

<style lang="scss"></style>
