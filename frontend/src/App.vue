<script setup lang="ts">
import Container from "./components/Container.vue";
</script>

<template>
  <main class="m-4">
    <container class="flex flex-col items-center">
      <router-view></router-view>
    </container>
  </main>
</template>
