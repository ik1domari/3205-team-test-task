<script lang="ts" setup>
import { inject, ref } from "vue";
import type { VueCookies } from "vue-cookies";
import axios, { AxiosError } from "axios";
import { useRouter } from "vue-router";
import ShadowBox from "../components/ShadowBox.vue";

const login = ref<string>("");
const name = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const loading = ref<boolean>(false);
const errorText = ref<string>("");
const successText = ref<string>("");

const router = useRouter();
const $cookies = inject<VueCookies>("$cookies");

const onClickRegister = async () => {
  try {
    if (!login.value || !password.value) {
      errorText.value = "Enter login and password";
      return;
    }

    if (!confirmPassword.value) {
      errorText.value = "Confirm password";
      return;
    }

    if (!name.value) {
      errorText.value = "Enter name";
      return;
    }

    if (password.value !== confirmPassword.value) {
      errorText.value = "Passwords don't match";
      return;
    }

    loading.value = true;
    errorText.value = "";

    const { data } = await axios.post("http://localhost:8080/auth/register", {
      login: login.value,
      password: password.value,
      name: name.value,
    });

    $cookies?.set("token", data.token);
    successText.value = "Registration successful! Redirecting...";

    setTimeout(() => router.push("/"), 500);
  } catch (err) {
    if (err instanceof AxiosError && err.status === 403) {
      errorText.value = "User with this login already exists";
    } else {
      errorText.value = "Registration error";
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <shadow-box
    class="text-center border border-neutral-400 px-10 py-6 rounded-2xl shadow-lg"
  >
    <h1 class="text-2xl font-bold">Registration</h1>
    <form class="mt-4">
      <a-space direction="vertical" class="w-full">
        <a-input
          v-model:value="login"
          placeholder="Enter your login"
          @pressEnter="onClickRegister"
        />
        <a-input
          v-model:value="name"
          placeholder="Enter your name"
          @pressEnter="onClickRegister"
        />
        <a-input-password
          v-model:value="password"
          placeholder="Enter your password"
          @pressEnter="onClickRegister"
        />
        <a-input-password
          v-model:value="confirmPassword"
          placeholder="Confirm password"
          @pressEnter="onClickRegister"
        />
        <a-space class="flex justify-between w-full">
          <a-typography-link>
            <router-link to="/auth"
              >Already have an account? Log in</router-link
            >
          </a-typography-link>
          <a-button @click="onClickRegister" type="primary" :loading="loading">
            Register
          </a-button>
        </a-space>
      </a-space>
    </form>
    <a-typography-text v-if="errorText" class="mt-6" type="danger">
      {{ errorText }}
    </a-typography-text>
    <a-typography-text v-if="successText" class="mt-6" type="success">
      {{ successText }}
    </a-typography-text>
  </shadow-box>
</template>
