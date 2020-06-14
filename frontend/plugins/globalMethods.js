import Vue from 'vue'

Vue.mixin({
  computed: {
    testeC () {
      return 'teste'
    }
  },
  methods: {
    testeM (value) {
      return value
    }
  },
})