import AuthPage from '@/pages/AuthPage.vue'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import WeatherPage from '@/pages/WeatherPage.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterPage
    },
    {
      path: "/login",
      name: "Login",
      component: AuthPage
    },
    {
      path: "/weather",
      name: "Weather",
      component: WeatherPage
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfilePage
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundPage
    }
  ],
})

export default router