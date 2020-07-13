<template>
  <v-container class="pa-0">
    <v-row align="center" justify="center" class="app-row">
      <v-card class="ma-3 pa-6 app-error-card text-center">
        <template v-if="error.statusCode === 404">
          <h3>Navegando por águas desconhecidas...</h3>

          <h1>Não conseguimos encontrar essa página.</h1>
        </template>

        <template v-else>
          <h3>Eita! Algo de errado não está certo...</h3>

          <h1>{{ error.message }}</h1>
        </template>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'external',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
}
</script>

<style scoped>
  h1 {
    font-size: 20px;
  }

  .app-error-card {
    width: 60vh;
  }
</style>
