<template>
  <div>
    <h1>Профиль</h1>
    <div class="row">
      <div class="col s6">
        <img
          v-if="user.avatarUrl"
          class="avatar"
          :src="user.avatarUrl"
          :alt="'avatar-' + user.name"
        />
        <p v-else>Аватара нет</p>
      </div>

      <div class="col s6">
        <form>
          <p>
            Ваш email: <strong>{{ user.email }}</strong>
          </p>
          <div class="input-field">
            <input
              id="name"
              name="name"
              type="text"
              class="validate"
              required
              v-model.trim="user.name"
            />
            <label for="name" class="active">Ваше имя</label>
            <span
              class="helper-text"
              data-error="Имя не может быть пустым"
            ></span>
          </div>

          <div class="file-field input-field">
            <div class="btn">
              <span>Аватар</span>
              <input type="file" name="avatar" ref="file" />
            </div>
            <div class="file-path-wrapper">
              <input class="file-path validate" type="text" />
            </div>
          </div>
          <button type="submit" class="btn" @click.prevent="changeInfo">
            Изменить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Add extends Vue {
  user = {
    name: "",
    email: "",
    avatarUrl: "",
  };
  async created(): Promise<void> {
    try {
      const { data } = await this.$http.get("/profile");
      this.user.name = data.name;
      this.user.email = data.email;
      this.user.avatarUrl = data.avatarUrl;
    } catch (e) {
      console.log(e);
    }
  }
  async changeInfo() {
    try {
      const formData = new FormData();
      let fileData: any = this.$refs.file;
      fileData = fileData.files[0];
      formData.append("avatar", fileData);
      formData.append("name", this.user.name);

      const { data } = await this.$http.put("/profile", formData);
      this.user.avatarUrl = data;
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  max-width: 300px;
  height: auto;
}
</style>
