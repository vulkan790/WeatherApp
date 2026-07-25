<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "../stores/auth.js"
import { useWeatherStore } from "../stores/weather.js"

const router = useRouter()
const authStore = useAuthStore()
const weatherStore = useWeatherStore()
const editingCity = ref(false)
const newCity = ref("")
const cityInfo = ref(null)

const saveCity = async () => {
    try 
    {
        const info = await weatherStore.geocodeCity(newCity.value)
        cityInfo.value = info
        authStore.updateCity(info.name)
        editingCity.value = false
    }
    catch (e)
    {
        alert(e.message)
    }
}

const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти?"))
    {
        authStore.logout()
        router.push("/login")
    }
}
</script>

<template>
    <div class="profile">
        <div v-if="authStore.isLoggedIn" class="profile-card">
            <h1>Профиль пользователя</h1>
            <div class="profile-info">
                <div class="info-section">
                    <div class="info-item">
                        <label>Имя</label>
                        <p>{{ authStore.userName }}</p>
                    </div>
                    <div class="info-item">
                        <label>Город</label>
                        <div v-if="!editingCity">
                            <p>{{ authStore.userCity || 'Не указан' }}</p>
                            <button @click="editingCity = true">Изменить</button>
                        </div>
                        <div v-else>
                            <input v-model="newCity" placeholder="Новый город" />
                            <button @click="saveCity">Сохранить</button>
                            <button @click="editingCity = false">Отмена</button>
                            <div v-if="cityInfo" class="city-info">
                                <p>{{ cityInfo.displayName }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="info-item">
                        <label>Email</label>
                        <p>{{ authStore.userEmail }}</p>
                    </div>
                    <div class="info-item">
                        <label>ID пользователя</label>
                        <p>{{ authStore.user?.id }}</p>
                    </div>
                    <div class="info-item">
                        <label>Статус</label>
                        <p><span class="status-badge active">Активен</span></p>
                    </div>
                </div>
            </div>
            <div class="profile-actions">
                <button @click="router.push('/')" class="button-back">
                    На главную
                </button>
                <button @click="handleLogout" class="button-logout">
                    Выйти
                </button>
            </div>
        </div>
        <div v-else class="not-logged">
            <h2>Вы не авторизованы</h2>
            <p>Пожалуйста, войдите в аккаунт</p>
            <div class="actions">
                <RouterLink to="/login" class="button-link">Войти</RouterLink>
                <RouterLink to="/register" class="button-link register">Зарегистрироваться</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped src="../style.css"></style>