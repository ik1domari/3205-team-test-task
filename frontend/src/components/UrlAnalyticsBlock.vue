<script setup lang="ts">
import ShadowBox from "./ShadowBox.vue";
defineProps({
  clickCount: Number,
  lastIps: Array,
});
</script>

<template>
  <shadow-box>
    <a-space direction="vertical">
      <a-typography-text strong class="!text-xl"
        >URL analytics:</a-typography-text
      >
      <a-typography-text>
        <a-typography-text strong>Click count: </a-typography-text>
        {{ clickCount }}
      </a-typography-text>
      <a-typography-text>
        <a-typography-text strong>Last IPs: </a-typography-text>
        {{ lastIps.join(", ") }}
      </a-typography-text>
    </a-space>
  </shadow-box>
</template>
