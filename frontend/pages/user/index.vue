<template>
  <div>
    <v-row>
      <v-col cols="12">
        <app-text bold>Nome:</app-text>
        <app-text>{{ $auth.user.name }}</app-text>
      </v-col>

      <v-col cols="12">
        <app-text bold>E-mail:</app-text>
        <app-text>{{ $auth.user.email }}</app-text>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    layout: 'default'
  }
</script>

<style>

</style>