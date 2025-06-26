<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios, { AxiosError } from "axios";
import Container from "../components/Container.vue";

const route = useRoute();
const router = useRouter();

const shortUrl = route.params.shortUrl as string;

onMounted(async () => {
  try {
    const { data: ip } = await axios.get("https://api.ipify.org");
    const { data } = await axios.get(
      `http://localhost:8080/${shortUrl}?ip=${ip}`,
    );

    if (!data) {
      await router.push("/not-found");
    }

    window.location.href = data.originalUrl;
  } catch (err) {
    if (err instanceof AxiosError && err.status === 404) {
      await router.push("/not-found");
    } else if (err instanceof AxiosError && err.status === 410) {
      await router.push("/expired");
    }
    console.error(err);
  }
});
</script>

<template>
  <container>
    <a-typography-text strong>Redirecting...</a-typography-text>
  </container>
</template>
