<template>
  <nav>
    <div class="nav-wrapper">
      <router-link class="brand-logo" :to="{ name: 'Home' }">
        Магазин курсов
      </router-link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <template v-for="link in links">
          <router-link
            v-if="link.show ? link.show : isAuth"
            :key="link.link"
            :to="{ name: link.link }"
            tag="li"
            active-class="active"
            exact
          >
            <a>{{ link.name }}</a>
          </router-link>
        </template>
        <router-link
          v-if="!isAuth"
          :to="{ name: 'Auth' }"
          tag="li"
          active-class="active"
          exact
        >
          <a>Войти</a>
        </router-link>
        <li v-if="isAuth">
          <a href="/" @click.prevent="logout">Выйти</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Navigation extends Vue {
  links: Array<object> = [
    {
      name: "Главная",
      link: "Home",
      show: true,
    },
    {
      name: "Курсы",
      link: "Courses",
      show: true,
    },
    {
      name: "Добавить курс",
      link: "Add",
      show: false,
    },
    {
      name: "Корзина",
      link: "Card",
      show: false,
    },
    {
      name: "Заказы",
      link: "Orders",
      show: false,
    },
    {
      name: "Профиль",
      link: "Profile",
      show: false,
    },
  ];
  get isAuth(): string {
    return this.$store.state.isAuth;
  }
  async logout(): Promise<any> {
    try {
      await this.$http.get("/auth/logout");
      window.location.assign("/");
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style scoped lang="scss">
.nav-wrapper {
  padding: 0 2rem;
}
</style>
