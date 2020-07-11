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

      }
    },
    methods: {
      async registerUser(userInfo) {
        const { email, password } = userInfo

        await this.$axios.post('/signup', userInfo)

        let response = await this.$auth.loginWith('local', {
          data: {
            email,
            password,
            expires: 84000
          }
        })
      }
    }
  }
</script>