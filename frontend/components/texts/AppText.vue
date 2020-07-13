<template>
  <span :class="`${bold ? 'font-weight-bold' : ''}`">
    <slot />
  </span>
</template>

<script>
  export default {
    props: {
      bold: { type: Boolean, default: false}
    }
  }
</script>

<style>

</style>