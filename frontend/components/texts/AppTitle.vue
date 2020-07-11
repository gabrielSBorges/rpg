<template>
  <h2 v-if="main">
    <slot />
  </h2>

  <h3 v-else-if="sub">
    <slot />
  </h3>
</template>

<script>
  export default {
    props: {
      main: { type: Boolean, default: false },
      sub: { type: Boolean, default: false },
    },
  }
</script>

<style>
  h1, h2, h3, h4 {
    padding: 0;
    margin: 0;
  }
</style>