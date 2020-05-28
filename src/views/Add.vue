<template>
  <div>
    <h1>Добавить новый курс</h1>
    <p class="alert" v-if="error">{{ error }}</p>
    <form>
      <div class="input-field">
        <input
          id="title"
          name="title"
          type="text"
          class="validate"
          required
          v-model="title"
        />
        <label for="title">Название курса</label>
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
        <label for="price">Цена курса</label>
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
        <label for="img">URL картинки</label>
        <span class="helper-text" data-error="Введите url картинки"></span>
      </div>
      <button class="btn btn-primary" type="reset" @click="addCourse">
        Добавить курс
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Add extends Vue {
  title = "";
  img = "";
  price = NaN;
  error = "";
  async addCourse(): Promise<void> {
    try {
      await this.$http.post("/add", {
        title: this.title,
        img: this.img,
        price: this.price,
      });
      await this.$router.push({ name: "Courses" });
    } catch (e) {
      console.log(e);
      if (e.status === 422 && e.data) {
        this.error = e.data;
      }
    }
  }
}
</script>

<style lang="scss"></style>
