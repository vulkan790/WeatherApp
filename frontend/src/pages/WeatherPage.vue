<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from "../stores/auth.js"
import { useWeatherStore } from "../stores/weather.js"

import SavedCity from "../components/SavedCities.vue"
import WeatherCard from "../components/WeatherCard.vue"

const authStore = useAuthStore()
const weatherStore = useWeatherStore()
const searchCity = ref("")

const isSaved = computed(() => {
    if (!weatherStore.weatherData)
        return false
    return weatherStore.savedCities.includes(weatherStore.weatherData.city)
})

const handleSearch = () => {
    if (searchCity.value.trim())
        weatherStore.fetchWeather(searchCity.value)
}

const handleSave = () => {
    if (weatherStore.weatherData && authStore.user)
        weatherStore.addCity(weatherStore.weatherData.city)
}

const handleSelectSaved = (city) => {
    searchCity.value = city
    weatherStore.fetchWeather(city)
}

const handleRemoveSaved = (city) => {
    if (authStore.user)
        weatherStore.removeCity(city)
}

onMounted(() => {
    if (authStore.user)
        weatherStore.loadSavedCities()
})
</script>

<template>
    <div v-if="authStore.isLoggedIn" class="weather-page">
        <h1>🌤️ Погода</h1>
        <div class="search-bar">
            <input 
                v-model="searchCity"
                placeholder="Введите город..."
                @keyup.enter="handleSearch">
            <button @click="handleSearch" :disabled="weatherStore.loading">Найти</button>
        </div>
        <div v-if="weatherStore.error" class="error">{{ weatherStore.error }}</div>
        <div v-if="weatherStore.loading" class="loading">Загрузка...</div>
        <WeatherCard
            v-if="weatherStore.weatherData"
            :data="weatherStore.weatherData"
            :saved="isSaved"
            @save="handleSave" />
        <SavedCity
            v-if="authStore.isLoggedIn"
            :cities="weatherStore.savedCities"
            @select="handleSelectSaved"
            @remove="handleRemoveSaved"/>
    </div>
    <div v-else class="should">
        Чтобы увидеть всю информацию, следует войти или зарегистрироваться
    </div>
</template>

<style scoped src="../style.css"></style>