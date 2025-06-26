<script setup lang="ts">
import ShadowBox from "../components/ShadowBox.vue";
</script>

<template>
  <shadow-box>
    <a-typography
      >This url is expired.
      <a-typography-link>
        <router-link to="/">Home</router-link>
      </a-typography-link>
    </a-typography>
  </shadow-box>
</template>
