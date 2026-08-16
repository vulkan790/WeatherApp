<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore} from "./stores/auth.js"

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти?"))
    {
        authStore.logout()
        router.push("/login")
    }
}
</script>

<template>
  <div class="app">
    <nav class="nav-bar">
        <div class="nav-brand">
            🌤️ Погода
        </div>
        <div class="nav-links">
            <RouterLink to="/" class="nav-link">Главная</RouterLink>
            <RouterLink to="/weather" class="nav-link">Погода</RouterLink>
            <RouterLink to="/profile" class="nav-link">Профиль</RouterLink>
        </div>
        <div class="nav-user">
            <div v-if="authStore.isLoggedIn">
                <span class="user-name">{{ authStore.userName }}</span>
                <span v-if="authStore.userCity" class="city-badge">{{ authStore.userCity }}</span>
                <button @click="handleLogout" class="logout-button">
                    Выйти
                </button>
            </div>
            <div v-else class="logreg-button">
                <RouterLink to="/login" class="nav-link">Войти</RouterLink>
                <RouterLink to="/register" class="nav-link">Регистрация</RouterLink>
            </div>
        </div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped src="./style.css"></style>