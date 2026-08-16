<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "../stores/auth.js"

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
    email: "",
    password: ""
})

const errors = reactive({
    email: "",
    password: ""
})

const validateForm = () => {
    let isValid = true
    errors.email = ""
    errors.password = ""

    if (!authStore.validateEmail(form.email))
    {
        errors.email = "Введите корректный email адрес"
        isValid = false
    }

    if (!authStore.validatePassword(form.password))
    {
        errors.password = "Пароль должен содержать минимум 8 символов"
        isValid = false
    }

    return isValid
}

const handleLogin = async () => {
    authStore.clearError()

    if (!validateForm())
        return

    const success = await authStore.login(form)
    if (success)
        router.push("/profile")
}
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Авторизация</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">email</label>
                    <input 
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="example@example.e"
                        :class="{ error: errors.email }"
                    />
                    <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
                </div>
                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input 
                        id="password"
                        v-model="form.password"
                        type="password"
                        placeholder="Минимум 6 символов"
                        :class="{ error: errors.password }"
                    />
                    <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
                </div>
                <div v-if="authStore.error" class="error-message">{{ authStore.error }}</div>
                <button type="submit" :disabled="authStore.loading" class="auth-button">
                    {{ authStore.loading ? "Авторизация..." : "Авторизоваться" }}
                </button>
            </form>
            <div class="auth-footer">
                Нет аккаунта?
                <RouterLink to="/register" class="auth-link">Зарегистрироваться</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>