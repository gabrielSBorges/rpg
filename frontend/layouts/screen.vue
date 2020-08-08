<template>
  <div>
    teste
    <nuxt />
  </div>
</template>

<script>
  export default {
    methods: {
      // Modifica o valor do breakpoint no store
      resizeEventHandler() {
        console.log(1);
        this.$store.commit('setBreakpoint', this.$vuetify.breakpoint.name)
      }
    },
    beforeMount() {
      console.log(1);
      // Event listener que identifica o resize
      window.addEventListener("resize", this.resizeEventHandler)
    },
    beforeDestroy() {
      // Encerra o eventListener
      window.removeEventListener("resize", this.resizeEventHandler);
    }
  }
</script>