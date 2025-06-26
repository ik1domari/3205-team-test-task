<script setup lang="ts">
import ShadowBox from "../components/ShadowBox.vue";
</script>

<template>
  <shadow-box>
    <a-typography
      >Nothing found for this url.
      <a-typography-link>
        <router-link to="/">Home</router-link>
      </a-typography-link>
    </a-typography>
  </shadow-box>
</template>
