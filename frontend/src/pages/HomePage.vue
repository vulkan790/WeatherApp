<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from "../stores/auth.js"

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти?"))
    {
        authStore.logout()
        router.push("/login")
    }
}

const goToProfile = () => {
    router.push("/profile")
}
</script>

<template>
    <div class="home">
        <div class="hero">
            <h1>Добро пожаловать!</h1>
            <p v-if="authStore.isLoggedIn" class="welcome">
                Вы вошли как <strong>{{ authStore.userName }}</strong>
            </p>
            <p v-else>
                Пожалуйста, <RouterLink to="/login" class="link">войдите</RouterLink> 
                или <RouterLink to="/register" class="link">зарегистрируйтесь</RouterLink>
            </p>
        </div>
        <div v-if="authStore.isLoggedIn" class="user-card">
            <div class="user-info">
                <div class="user-details">
                    <h2>{{ authStore.userName }}</h2>
                    <p class="user-email">{{ authStore.userEmail }}</p>
                    <p class="user-id">ID: {{ authStore.user?.id }}</p>
                </div>
            </div>
            <div class="user-actions">
                <button @click="goToProfile" class="button-profile">
                    Редактировать профиль
                </button>
                <button @click="handleLogout" class="button-logout">
                    Выйти из аккаунта
                </button>
            </div>
        </div>
        <div v-else class="request">
            Чтобы увидеть всю информацию, следует войти или зарегистрироваться
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>