import '@/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import toast from "vue-toastification"

const app = createApp(App)
const currentUser = { id: null, username: null, ubisoftUserId: null, ubisoftUsername: null, isLoggedIn: false, comparisonNames: {} };

app.use(router);
app.use(toast);

app.mount('#app')

export { currentUser };