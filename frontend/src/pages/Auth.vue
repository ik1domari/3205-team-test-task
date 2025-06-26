<script lang="ts" setup>
import { inject, ref } from "vue";
import type { VueCookies } from "vue-cookies";

import axios, { AxiosError } from "axios";
import { useRouter } from "vue-router";
import ShadowBox from "../components/ShadowBox.vue";

const login = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const errorText = ref<string>("");

const router = useRouter();

const $cookies = inject<VueCookies>("$cookies");

const onClickLogin = async () => {
  try {
    if (!login.value || !password.value) {
      errorText.value = "Enter login and password";
      return;
    }
    loading.value = true;
    const { data } = await axios.post("http://localhost:8080/auth/login", {
      login: login.value,
      password: password.value,
    });

    $cookies?.set("token", data.token);

    await router.push("/");
  } catch (err) {
    if (err instanceof AxiosError && err.status === 401) {
      errorText.value = "Wrong login or password";
    } else {
      errorText.value = "Authorization error";
    }
    console.log(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <shadow-box
    class="text-center border border-neutral-400 px-10 py-6 rounded-2xl shadow-lg"
  >
    <h1 class="text-2xl font-bold">Auth</h1>
    <form class="mt-4">
      <a-space direction="vertical">
        <a-input v-model:value="login" placeholder="Enter your login" />
        <a-input-password
          v-model:value="password"
          placeholder="Enter your password"
        />
        <a-space class="flex justify-between w-full">
          <a-typography-link>
            <router-link to="/registration">No account? Sign up</router-link>
          </a-typography-link>
          <a-button :onClick="onClickLogin" type="primary" :loading="loading">
            Log in
          </a-button>
        </a-space>
      </a-space>
    </form>
    <a-typography-text v-if="errorText" class="mt-6" type="danger">{{
      errorText
    }}</a-typography-text>
  </shadow-box>
</template>
