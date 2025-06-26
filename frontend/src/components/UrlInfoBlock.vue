<script setup lang="ts">
import ShadowBox from "./ShadowBox.vue";
defineProps({
  originalUrl: String,
  clickCount: Number,
  createdAt: Date,
});
</script>

<template>
  <shadow-box>
    <a-space direction="vertical">
      <a-typography-text strong class="!text-xl">URL Info:</a-typography-text>
      <a-typography-text>
        <a-typography-text strong>Original URL: </a-typography-text>
        <a-typography-link :href="originalUrl" target="_blank">
          {{ originalUrl }}
        </a-typography-link>
      </a-typography-text>

      <a-typography-text>
        <a-typography-text strong>Click count: </a-typography-text>

        {{ clickCount }}
      </a-typography-text>

      <a-typography-text v-if="createdAt">
        <a-typography-text strong>Created at: </a-typography-text>
        {{ new Date(createdAt).toLocaleString() }}
      </a-typography-text>
    </a-space>
  </shadow-box>
</template>
