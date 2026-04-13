import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import axios from 'axios'
import './assets/tailwind.css'
import { useAuthStore } from './store/auth'

// Cấu hình axios để luôn gửi kèm Cookie Session
axios.defaults.withCredentials = true;

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Nạp thông tin session từ backend trước khi render
const authStore = useAuthStore(pinia)
authStore.fetchSession().then(() => {
  app.use(router)
  app.mount('#app')
})

