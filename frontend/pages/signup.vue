<template>
  <app-user-auth-form register buttonText="Cadastre-se" :submitForm="registerUser" />
</template>

<script>
  import AppUserAuthForm from '@/components/forms/AppUserAuthForm'
  export default {
    layout: 'external',
    components: {
      AppUserAuthForm
    },
    data() {
      return {
        logged: this.$auth.loggedIn,
      }
    },
    methods: {
      async registerUser(userInfo) {
        const { email, password } = userInfo

        try {
          await this.$axios.post('/signup', userInfo)
  
          let response = await this.$auth.loginWith('local', {
            data: {
              email,
              password,
              expires: 84000
            }
          })

          this.$router.push('/')

          this.showSuccessMessage(`Conta cadastrada com sucesso. Bem vindo, ${this.$auth.user.name}!`)
        }
        catch(error) {
          this.showErrorMessage('Não conseguimos te cadastrar, tente novamente.')
        }
      }
    },
    created() {
      if (this.logged) {
        this.$router.push('/')
      }
    }
  }
</script>