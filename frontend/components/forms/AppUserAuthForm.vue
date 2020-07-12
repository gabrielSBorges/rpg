<template>
  <v-container class="pa-0">
    <v-row align="center" justify="center" class="app-row">
      <v-card class="ma-3 pa-6 app-auth-card text-center">
        <app-title main class="mb-5">{{ title }}</app-title>
        
        <v-form v-model="valid">
          <v-text-field 
            v-if="register" 
            v-model="userInfo.name" 
            label="Nome" 
            :rules="[required('name')]" 
          />

          <v-text-field 
            v-model="userInfo.email" 
            label="E-mail" 
            type="email"
            :rules="[required('email'), emailFormat()]" 
          />

          <v-text-field 
            v-model="userInfo.password" 
            label="Senha" 
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="[required('password'), minLength('password', 8)]" 
          />

          <v-btn @click="submitForm(userInfo)" :disabled="!valid" block color="success" class="mt-5">{{ buttonText }}</v-btn>
        </v-form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
  import validate from "@/utils/validations"

  export default {
    props: {
      submitForm: { type: Function, default: null },
      register: { type: Boolean, default: false },
      buttonText: { type: String, default: 'Entrar' },
      title: { type: String, default: 'Bem vindo!' },
    },
    data() {
      return {
        valid: false,
        showPassword: false,
        userInfo: {
          email: '',
          password: ''
        },
        ...validate
      }
    }
  }
</script>

<style>
  .app-auth-card {
    width: 60vh;
  }
</style>