<template>
  <div>
    <h1>Мои заказы</h1>
    <template v-if="orders.length">
      <div class="row" v-for="order in orders" :key="order._id">
        <div class="col s6 offset-s3">
          <div class="card">
            <div class="card-content">
              <span class="card-title">
                Заказ <small>{{ order._id }}</small>
              </span>
              <p class="date">{{ toDate(order.date) }}</p>
              <p>
                <em>{{ order.user.userId.name }}</em> ({{
                  order.user.userId.email
                }})
              </p>
              <ol>
                <li v-for="course in order.courses" :key="course._id">
                  {{ course.course.title }} (x<strong>
                    {{ course.count }} </strong
                  >)
                </li>
              </ol>
              <hr />
              <p>
                Цена: <span class="price">{{ toCurrency(order.price) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <p v-else>Заказов пока нет</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Add extends Vue {
  orders = [];

  toCurrency(price: number): string {
    return new Intl.NumberFormat("uk-UA", {
      currency: "uah",
      style: "currency",
    }).format(price);
  }

  toDate(date: number): string {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  }

  async created(): Promise<void> {
    try {
      const response = await this.$http.get("/orders");
      const data = response.data;
      this.orders = data.orders;
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss"></style>
