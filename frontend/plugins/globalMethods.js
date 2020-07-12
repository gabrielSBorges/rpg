import Vue from 'vue'

Vue.mixin({
  methods: {
    showSuccessMessage(message) {
      this.$toast.success(message)
    },

    showErrorMessage(message) {
      this.$toast.global.error(message)
    },

    showAlertMessage(message) {
      this.$toast.global.alert(message)
    },

    showInfoMessage(message) {
      this.$toast.info(message)
    },

    showDefaultMessage(message) {
      this.$toast.show(message)
    }
  },
})