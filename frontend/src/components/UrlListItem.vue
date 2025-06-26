<script setup lang="ts">
import ShadowBox from "./ShadowBox.vue";

defineProps({
  originalUrl: String,
  shortUrl: String,
  alias: String,
});
</script>

<template>
  <shadow-box>
    <a-space direction="vertical">
      <a-typography-text>
        <a-typography-text strong>Original URL:</a-typography-text>
        <a-typography-link :href="originalUrl" target="_blank">
          {{ originalUrl }}
        </a-typography-link>
      </a-typography-text>

      <a-typography-text>
        <a-typography-text strong>Short URL:</a-typography-text>
        <a-typography-link
          :href="`http://localhost:5173/${shortUrl}`"
          target="_blank"
        >
          {{ shortUrl }}
        </a-typography-link>
      </a-typography-text>

      <a-typography-text v-if="alias">
        <a-typography-text strong>{{ alias }}</a-typography-text>
      </a-typography-text>
    </a-space>
  </shadow-box>
</template>
