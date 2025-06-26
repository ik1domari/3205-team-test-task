<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { VueCookies } from "vue-cookies";
import type { Url } from "../../@types/url.ts";
import axios from "axios";
import ShadowBox from "../components/ShadowBox.vue";
import UrlListItem from "../components/UrlListItem.vue";

const urlController = ref<string>("");
const aliasController = ref<string>("");
const expireDateController = ref<Date>();
const take = ref<number>(3);

const errorText = ref<string>("");
const successText = ref<string>("");
const loadingUrls = ref<boolean>(true);

const existingUrls = ref<Url[]>([]);

const $cookies = inject<VueCookies>("$cookies");
const router = useRouter();

const fetchUrls = async (take: number) => {
  try {
    const token = $cookies?.get("token");
    if (!token) {
      await router.push("/auth");
      return;
    }

    const { data } = await axios.get(
      `http://localhost:8080/urls/getall?take=${take}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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
      await fetchUrls();
    }
  } catch (error) {
    console.log(error);
    errorText.value = "Something went wrong";
  }
};

onMounted(fetchUrls);
</script>

<template>
  <shadow-box>
    <h1 class="text-3xl font-bold">URL Shortener</h1>
    <form class="mt-4">
      <a-space direction="vertical">
        <a-input v-model:value="urlController" placeholder="Enter url" />
        <a-input v-model:value="aliasController" placeholder="Enter alias" />
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
  <a-button type="primary" v-if="take < existingUrls.length" @click="take += 3"
    >Show more</a-button
  >
</template>
