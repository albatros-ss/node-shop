<template>
  <div class="auth">
    <div class="row">
      <div class="col s6 offset-s3">
        <p
          :class="{
            alert: error,
            success: !error,
          }"
          v-show="text"
        >
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Auth extends Vue {
  text = "";
  error = false;

  async created(): Promise<any> {
    try {
      const { data } = await this.$http.get(
        "/auth/confirm/" + this.$route.params.token
      );
      this.error = !data.status;
      this.text = data.text;
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
