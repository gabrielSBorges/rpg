<template>
  <app-user-auth-form :submitForm="loginUser" />
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
      async loginUser(userInfo) {
        const { email, password } = userInfo

        try {
          let response = await this.$auth.loginWith('local', {
            data: {
              email,
              password,
              expires: 84000
            }
          })
  
          this.showSuccessMessage(`Bem vindo, ${this.$auth.user.name}!`)
          
          this.$router.push('/')
        }
        catch(error) {
          this.showErrorMessage('Email ou senha incorretos!')
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