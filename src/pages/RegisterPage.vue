<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "../stores/auth.js"
import { useWeatherStore } from "../stores/weather.js"

const router = useRouter()
const authStore = useAuthStore()
const weatherStore = useWeatherStore()
const cityInfo = ref(null)

const form = reactive({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: ""
})

const errors = reactive({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: ""
})

const checkCity = async () => {
    cityInfo.value = null
    errors.city = ""

    if (!form.city.trim())
        return

    try
    {
        const info = await weatherStore.geocodeCity(form.city)
        cityInfo.value = info
    }
    catch (e)
    {
        errors.city = e.message
    }
}

const validateForm = () => {
    let isValid = true
    errors.name = ""
    errors.email = ""
    errors.password = ""
    errors.confirmPassword = ""

    if (!form.name.trim())
    {
        errors.name = "Поле 'имя' обязательно должно быть заполнено"
        isValid = false
    }

    if (!form.city.trim())
    {
        errors.city = "Укажите город"
        isValid = false
    }
    
    if (!authStore.validateEmail(form.email))
    {
        errors.email = "Введите корректный email адрес"
        isValid = false
    }

    if (!authStore.validatePassword(form.password))
    {
        errors.password = "Пароль должен содержать минимум 6 символов"
        isValid = false
    }

    if (form.password !== form.confirmPassword)
    {
        errors.confirmPassword = "Пароли не совпадают"
        isValid = false
    }

    return isValid
}

const handleRegister = async () => {
    authStore.clearError()

    if (!validateForm())
        return

    const success = await authStore.register(form)
    if (success)
        router.push("/profile")
}
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Регистрация</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="name">Имя</label>
                    <input 
                        id="name"
                        v-model="form.name"
                        type="text"
                        placeholder="Введите ваше имя"
                        :class="{ error: errors.name }"
                    />
                    <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                    <label for="city">Город</label>
                    <input
                        id="city"
                        v-model="form.city"
                        type="text"
                        placeholder="Введите ваш город"
                        :class="{ error: errors.city }"
                        @blur="checkCity"
                    />
                    <div v-if="cityInfo" class="city-info">
                        <p><strong>{{ cityInfo.name }}</strong> ({{ cityInfo.type }})</p>
                        <p>{{ cityInfo.displayName }}</p>
                    </div>
                    <span v-if="errors.city" class="error-text">{{ errors.city }}</span>
                </div>
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
                <div class="form-group">
                    <label for="confirmPassword">Подтверждение пароля</label>
                    <input 
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        type="password"
                        placeholder="Подтвердите пароль"
                        :class="{ error: errors.confirmPassword }"
                    />
                    <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
                </div>
                <div v-if="authStore.error" class="error-message">{{ authStore.error }}</div>
                <button type="submit" :disabled="authStore.loading" class="auth-button">
                    {{ authStore.loading ? "Регистрация..." : "Зарегистрироваться" }}
                </button>
            </form>
            <div class="auth-footer">
                Уже есть аккаунт?
                <RouterLink to="/login" class="auth-link">Войти</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>