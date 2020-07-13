import Vue from 'vue'
import AppTitle from '~/components/texts/AppTitle.vue'
import AppText from '~/components/texts/AppText.vue'

Vue.use(AppTitle, AppText)

Vue.component('app-title', AppTitle)
Vue.component('app-text', AppText)