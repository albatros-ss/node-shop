<template>
  <div class="auth">
    <div class="row" v-if="getConfirmUser">
      <template v-if="!forgotten">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s6">
              <a
                href="#"
                :class="{ active: !createLogin }"
                @click.prevent="tab(false)"
                >Войти</a
              >
            </li>
            <li class="tab col s6">
              <a
                href="#"
                :class="{ active: createLogin }"
                @click.prevent="tab(true)"
                >Регистрация</a
              >
            </li>
          </ul>
        </div>
        <div class="col s6 offset-s3" v-show="!createLogin">
          <p class="alert" v-show="error">{{ error }}</p>
          <h1>Войти в магазин</h1>
          <form @submit.prevent="authAction">
            <div class="input-field">
              <input
                id="email"
                type="email"
                class="validate"
                required
                v-model.trim="email"
              />
              <label for="email">Email</label>
              <span class="helper-text" data-error="Введите email"></span>
            </div>

            <div class="input-field">
              <input
                id="password"
                type="password"
                class="validate"
                required
                v-model.trim="password"
              />
              <label for="password">Пароль</label>
              <span class="helper-text" data-error="Введите пароль"></span>
            </div>
            <p>
              <a href="#" @click.prevent="forgotten = true">Забыли пароль?</a>
            </p>
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="!email || !password"
            >
              Войти
            </button>
          </form>
        </div>
        <div class="col s6 offset-s3" v-show="createLogin">
          <p class="alert" v-if="error">{{ error }}</p>
          <h1>Создать аккаунт</h1>
          <form @submit.prevent="registerAction">
            <div class="input-field">
              <input
                id="remail"
                type="email"
                class="validate"
                required
                v-model.trim="email"
              />
              <label for="remail">Email</label>
              <span class="helper-text" data-error="Введите email"></span>
            </div>

            <div class="input-field">
              <input
                id="rpassword"
                type="password"
                class="validate"
                required
                v-model.trim="password"
              />
              <label for="rpassword">Пароль</label>
              <span class="helper-text" data-error="Введите пароль"></span>
            </div>

            <div class="input-field">
              <input
                id="confirm"
                type="password"
                class="validate"
                required
                v-model.trim="repeatPassword"
              />
              <label for="confirm">Пароль еще раз</label>
              <span class="helper-text" data-error="Введите пароль"></span>
            </div>

            <div class="input-field">
              <input
                id="name"
                type="text"
                class="validate"
                required
                v-model.trim="name"
              />
              <label for="name">Ваше имя</label>
              <span class="helper-text" data-error="Введите имя"></span>
            </div>

            <button
              class="btn btn-primary"
              type="submit"
              :disabled="!email || !password || !repeatPassword || !name"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      </template>
      <template v-else>
        <div class="col s6 offset-s3">
          <p class="alert" v-show="reset.error">{{ reset.error }}</p>
          <h1>Забыли пароль?</h1>
          <form @submit.prevent="resetPassword">
            <div class="input-field">
              <input
                id="reset-email"
                type="email"
                class="validate"
                required
                v-model.trim="reset.email"
              />
              <label for="reset-email">Email</label>
              <span class="helper-text" data-error="Введите email"></span>
            </div>
            <p>
              <a href="#" @click.prevent="forgotten = false">
                Вернутся на форму логина
              </a>
            </p>
            <button class="btn btn-primary" type="submit">Сбросить</button>
          </form>
        </div>
      </template>
    </div>
    <div class="row" v-else>
      <div class="col s6 offset-s3">
        <p class="alert">Вы не подтвердили пользователя</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Auth extends Vue {
  error = "";
  createLogin = false;
  email = "";
  password = "";
  repeatPassword = "";
  name = "";
  forgotten = false;

  reset = {
    error: "",
    email: "",
  };

  get getConfirmUser() {
    return this.$store.state.confirmUser;
  }

  tab(flag: boolean): void {
    this.createLogin = flag;
    this.email = "";
    this.password = "";
    this.repeatPassword = "";
    this.name = "";
    this.error = "";
  }
  async registerAction(): Promise<void> {
    this.error = "";
    if (this.password !== this.repeatPassword) {
      this.error = "Пароли не совпадают";
    } else {
      try {
        const { data } = await this.$http.post("/auth/register", {
          email: this.email,
          password: this.password,
          name: this.name,
        });
        this.error = data;
        if (!data) {
          this.$store.commit("changeAuth", true);
          this.$store.commit("changeConfirmUser", true);
          await this.$router.push({ name: "Home" });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  async authAction(): Promise<void> {
    try {
      const { data } = await this.$http.post("/auth/login", {
        email: this.email,
        password: this.password,
      });
      this.error = data;
      if (!data) {
        this.$store.commit("changeAuth", true);
        this.$store.commit("changeConfirmUser", true);
        await this.$router.push({ name: "Home" });
      }
    } catch (e) {
      console.log(e);
    }
  }
  async resetPassword(): Promise<void> {
    try {
      const { data } = await this.$http.put("/auth/reset", {
        email: this.reset.email,
      });
      this.reset.error = data;
      if (!data) {
        this.forgotten = false;
        this.reset = {
          error: "",
          email: "",
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
.tabs .tab a:focus {
  background-color: transparent;
  outline: none;
}
.tabs .tab a:focus.active {
  background-color: rgba(246, 178, 181, 0.2);
}
.tabs .tab a.active {
  background-color: rgba(246, 178, 181, 0.2);
  outline: none;
}
.auth {
  padding-top: 1rem;
}

.alert {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1rem;
  background: rgba(255, 0, 0, 0.3);
  color: red;
}
.success {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1rem;
  background: rgba(0, 0, 255, 0.3);
  color: blue;
}
</style>
