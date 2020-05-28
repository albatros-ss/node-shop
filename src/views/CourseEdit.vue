<template>
  <div>
    <h1>Редактировать {{ name }}</h1>
    <p class="alert" v-if="error">{{ error }}</p>
    <form class="course-form">
      <div class="input-field">
        <input
          id="title"
          name="title"
          type="text"
          class="validate"
          required
          v-model="title"
        />
        <label for="title" class="active">Название курса</label>
        <span class="helper-text" data-error="Введите название"></span>
      </div>
      <div class="input-field">
        <input
          id="price"
          name="price"
          type="number"
          class="validate"
          required
          min="1"
          v-model="price"
        />
        <label for="price" class="active">Цена курса</label>
        <span class="helper-text" data-error="Введите цену"></span>
      </div>
      <div class="input-field">
        <input
          id="img"
          name="img"
          type="text"
          class="validate"
          required
          v-model="img"
        />
        <label for="img" class="active">URL картинки</label>
        <span class="helper-text" data-error="Введите url картинки"></span>
      </div>
      <button class="btn btn-primary" type="reset" @click="changeCourse">
        Редактировать курс
      </button>
    </form>
    <button class="btn red" @click="removeCourse">Удалить курс</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EditCourse extends Vue {
  name = "";
  title = "";
  img = "";
  price = NaN;
  error = "";
  async created(): Promise<void> {
    try {
      const { data } = await this.$http.get(
        "/course/" + this.$route.params.id + "/edit"
      );
      if (data.course.userId !== this.$store.state.userId) {
        await this.$router.replace({ name: "Courses" });
      }
      this.title = data.course.title;
      this.name = data.course.title;
      this.img = data.course.img;
      this.price = data.course.price;
    } catch (e) {
      console.log(e);
    }
  }
  async changeCourse(): Promise<void> {
    try {
      await this.$http.put("/course/edit/", {
        title: this.title,
        img: this.img,
        price: this.price,
        id: this.$route.params.id,
      });
      await this.$router.push({ name: "Courses" });
    } catch (e) {
      console.log(e);
      if (e.status === 422 && e.data) {
        this.error = e.data;
      }
    }
  }
  async removeCourse(): Promise<void> {
    try {
      await this.$http.delete("/course/remove/" + this.$route.params.id);
      await this.$router.push({ name: "Courses" });
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
.course-form {
  margin-bottom: 2rem;
}
</style>
