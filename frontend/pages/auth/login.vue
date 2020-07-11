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

      }
    },
    methods: {
      async loginUser(userInfo) {
        const { email, password } = userInfo

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