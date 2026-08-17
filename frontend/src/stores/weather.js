import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const useWeatherStore = defineStore("weather", () => {
    const currentCity = ref("")
    const weatherData = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const savedCities = ref([])

    const geocodeCity = async (city) => {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`)
        if (!geoRes.ok)
            throw new Error("Ошибка геокодинга")

        const data = await geoRes.json()
        if (!data.length)
            throw new Error("Город не найден")

        const item = data[0]
        const address = item.address || {}
        const type = item.type || "city"
        const displayName = item.display_name
        const cityName = address.city || address.town || address.village || address.municipality || address.county || address.state || item.name
        const country = address.country || ""
        return {
            name: cityName, displayName, country, type,
            lat: item.lat,
            lon: item.lon
        }
    }

    const loadSavedCities = async () => {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) 
            return

        try
        {
            const response = await fetch(`${API_URL}/cities/`, {
                headers: {
                    "Authorization": `Bearer ${authStore.token}`
                }
            })

            if (!response.ok)
                throw new Error('Не удалось загрузить города')

            const cities = await response.json()
            savedCities.value = cities.map(c => c.city_name)
        }
        catch (e)
        {
            error.value = e.message
        }
    }

    const addCity = async (cityName) => {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) 
            return

        try
        {
            const response = await fetch(`${API_URL}/cities/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`,
                },
                body: JSON.stringify({ city_name: cityName })
            })

            if (!response.ok) 
            {
                const data = await response.json()
                throw new Error(data.detail || 'Не удалось сохранить город')
            }

            await loadSavedCities()
        }
        catch (e)
        {
            error.value = e.message
        }
    }

    const removeCity = async (cityName) => {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) 
            return

        try
        {
            const response = await fetch(`${API_URL}/cities/${encodeURIComponent(cityName)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                }
            })

            if (!response.ok) 
            {
                const data = await response.json()
                throw new Error(data.detail || 'Не удалось удалить город')
            }

            await loadSavedCities()
        }
        catch (e)
        {
            error.value = e.message
        }
    }

    const getWeatherDescription = (code) => {
        const map = {
            0: { desc: 'Ясно', icon: '☀️' },
            1: { desc: 'Преимущественно ясно', icon: '🌤️' },
            2: { desc: 'Переменная облачность', icon: '⛅' },
            3: { desc: 'Пасмурно', icon: '☁️' },
            45: { desc: 'Туман', icon: '🌫️' },
            48: { desc: 'Туман с изморозью', icon: '🌫️' },
            51: { desc: 'Морось слабая', icon: '🌦️' },
            53: { desc: 'Морось умеренная', icon: '🌦️' },
            55: { desc: 'Морось сильная', icon: '🌧️' },
            61: { desc: 'Дождь слабый', icon: '🌧️' },
            63: { desc: 'Дождь умеренный', icon: '🌧️' },
            65: { desc: 'Дождь сильный', icon: '🌧️' },
            71: { desc: 'Снег слабый', icon: '❄️' },
            73: { desc: 'Снег умеренный', icon: '❄️' },
            75: { desc: 'Снег сильный', icon: '❄️' },
            80: { desc: 'Ливень слабый', icon: '🌧️' },
            81: { desc: 'Ливень умеренный', icon: '🌧️' },
            82: { desc: 'Ливень сильный', icon: '⛈️' },
            95: { desc: 'Гроза', icon: '⛈️' },
            96: { desc: 'Гроза с градом', icon: '⛈️' },
            99: { desc: 'Гроза с сильным градом', icon: '⛈️' },
        }
        return map[code] || { desc: 'Неизвестно', icon: '❓' }
    }

    const fetchWeather = async (city) => {
        loading.value = true
        error.value = null
        weatherData.value = null
        currentCity.value = city.trim()

        try
        {
            const geo = await geocodeCity(city)
            const {lat, lon, name} = geo

            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weathercode&timezone=auto`)
            if (!weatherRes.ok)
                throw new Error("Ошибка получения погоды")
            const w = await weatherRes.json()
            const current = w.current
            const desc = getWeatherDescription(current.weathercode)

            weatherData.value = {
                city: name,
                temp: Math.round(current.temperature_2m),
                humidity: Math.round(current.relative_humidity_2m),
                precipitation: Math.round(current.precipitation || 0),
                wind: Math.round(current.wind_speed_10m),
                description: desc.desc,
                icon: desc.icon,
                time: current.time
            }
        }
        catch (e)
        {
            error.value = e.message || "Не удалось загрузить погоду"
        }
        finally
        {
            loading.value = false
        }
    }

    return {
        currentCity,
        weatherData,
        loading,
        error,
        savedCities,
        geocodeCity,
        loadSavedCities,
        addCity,
        removeCity,
        fetchWeather
    }
})

export default useWeatherStore