<script lang="ts" setup>
import { inject, onMounted, provide, ref } from "vue";
import { useRouter } from "vue-router";
import type { VueCookies } from "vue-cookies";
import type { Url } from "../../@types/url.ts";
import axios, { AxiosError } from "axios";
import ShadowBox from "../components/ShadowBox.vue";
import UrlListItem from "../components/UrlListItem.vue";

const urlController = ref<string>("");
const aliasController = ref<string>("");
const expireDateController = ref<Date>();

const errorText = ref<string>("");
const successText = ref<string>("");
const loadingUrls = ref<boolean>(true);
const userName = ref<string>("");

const existingUrls = ref<Url[]>([]);

const $cookies = inject<VueCookies>("$cookies");
const router = useRouter();

const fetchData = async () => {
  try {
    const token = $cookies?.get("token");
    if (!token) {
      await router.push("/auth");
      return;
    }

    const { data: user } = await axios.get("http://localhost:8080/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!user) {
      await router.push("/auth");
      return;
    }

    userName.value = user.name;

    const { data } = await axios.get(`http://localhost:8080/urls/getall`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    existingUrls.value = data;
    console.log(data);
  } catch (error) {
    console.log(error);
    errorText.value = "Something went wrong";
  } finally {
    loadingUrls.value = false;
  }
};

const onClickShorten = async () => {
  try {
    if (urlController.value === "") {
      errorText.value = "URL field should be filled";
      return;
    }
    const token = $cookies?.get("token");

    if (!token) {
      await router.push("/auth");
      return;
    }

    const { data } = await axios.post(
      "http://localhost:8080/shorten",
      {
        originalUrl: urlController.value,
        alias: aliasController.value,
        expiresAt: expireDateController.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data.shortUrl) {
      successText.value = `Success. Your link is http://localhost:5173/${data.shortUrl}`;
      errorText.value = "";
      await fetchData();
    }
  } catch (error) {
    if (error instanceof AxiosError && error.status === 406) {
      errorText.value = "Alias should not be longer than 20 chars";
    }
    console.log(error);
    errorText.value = "Something went wrong";
  }
};

const onClickLogout = async () => {
  $cookies?.remove("token");
  await router.push("/auth");
};

onMounted(fetchData);

provide("onClickLogout", onClickLogout);
</script>

<template>
  <a-space class="flex justify-center w-full items-center">
    <a-typography-text class="text-3xl font-bold"
      >Hello, {{ userName }}!</a-typography-text
    >
    <a-button @click="onClickLogout">Logout </a-button>
  </a-space>

  <shadow-box class="mt-4">
    <a-space class="flex justify-between w-full items-center">
      <h1 class="text-3xl font-bold">URL Shortener</h1>
    </a-space>
    <form class="mt-4">
      <a-space direction="vertical">
        <a-input v-model:value="urlController" placeholder="Enter url" />
        <a-input
          :maxlength="20"
          v-model:value="aliasController"
          placeholder="Enter alias"
        />
        <a-date-picker
          class="w-full"
          v-model:value="expireDateController"
          placeholder="Expires at:"
        />
        <a-button @click="onClickShorten" type="primary">Shorten</a-button>
      </a-space>
    </form>
    <a-typography-text type="danger" v-if="errorText"
      >{{ errorText }}
    </a-typography-text>
    <a-typography-text type="success" v-if="successText"
      >{{ successText }}
    </a-typography-text>
  </shadow-box>

  <div v-for="url in existingUrls" class="mt-4">
    <UrlListItem
      :original-url="url.originalUrl"
      :short-url="url.shortUrl"
      :alias="url.alias"
    />
  </div>
</template>
