import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vue.config.productionTip = false is no longer needed in Vue 3

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')