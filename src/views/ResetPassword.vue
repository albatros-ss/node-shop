<template>
  <div class="row">
    <div class="col s6 offset-s3">
      <p class="alert" v-show="error">{{ error }}</p>
      <h1>Задать пароль</h1>
      <form @submit.prevent="resetPassword">
        <div class="input-field">
          <input
            id="password"
            name="password"
            type="password"
            class="validate"
            v-model.trim="password"
            required
          />
          <label for="password">Новый пароль</label>
          <span class="helper-text" data-error="Введите пароль"></span>
        </div>
        <button class="btn btn-primary" type="submit">Обновить пароль</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Add extends Vue {
  error = "";
  password = "";
  userId = 0;

  async created(): Promise<any> {
    try {
      const { data } = await this.$http.get(
        "/auth/password/" + this.$route.params.token
      );
      if (!data) {
        await this.$router.replace({ name: "Auth" });
      } else {
        this.userId = data;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async resetPassword() {
    try {
      const { data } = await this.$http.put("/auth/password", {
        userId: this.userId,
        token: this.$route.params.token,
        password: this.password,
      });
      if (data) {
        this.error = data;
      } else {
        await this.$router.push({ name: "Auth" });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss"></style>
