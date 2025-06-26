<script setup lang="ts">
import { inject, onMounted, reactive, ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import type { VueCookies } from "vue-cookies";
import UrlInfoBlock from "../components/UrlInfoBlock.vue";
import UrlAnalyticsBlock from "../components/UrlAnalyticsBlock.vue";

const shortUrl = useRoute().params.shortUrl as string;
const $cookies = inject<VueCookies>("$cookies");
const router = useRouter();

const userName = ref<string>("");

const urlInfo = reactive({
  originalUrl: "",
  clickCount: undefined,
  createdAt: undefined,
});

const urlAnalytics = reactive({
  clickCount: undefined,
  lastIps: [],
});

onMounted(async () => {
  const token = $cookies?.get("token");

  if (!token) {
    await router.push("/auth");
    return;
  }
  const { data } = await axios.get(`http://localhost:8080/info/${shortUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  urlInfo.originalUrl = data.originalUrl;
  urlInfo.clickCount = data.clickCount;
  urlInfo.createdAt = data.createdAt;

  const { data: analytics } = await axios.get(
    `http://localhost:8080/analytics/${shortUrl}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  urlAnalytics.clickCount = analytics.clickCount;
  urlAnalytics.lastIps = analytics.lastIps;
});

const onClickLogout = inject("onClickLogout");
</script>

<template>
  <a-space class="flex justify-center w-full items-center">
    <a-button @click="router.push('/')">Home</a-button>

    <a-typography-text class="text-3xl font-bold"
      >Hello, {{ userName }}!</a-typography-text
    >
    <a-button @click="onClickLogout">Logout </a-button>
  </a-space>
  <a-space class="mt-4" direction="vertical">
    <UrlInfoBlock
      :originalUrl="urlInfo.originalUrl"
      :clickCount="urlInfo.clickCount"
      :createdAt="urlInfo.createdAt"
    />

    <UrlAnalyticsBlock
      :clickCount="urlAnalytics.clickCount"
      :lastIps="urlAnalytics.lastIps"
    />
  </a-space>
</template>
