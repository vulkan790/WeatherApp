import { ref } from 'vue'
import { defineStore } from 'pinia'

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

    const loadSavedCities = (userId) => {
        const key = `savedCities_${userId}`
        const data = localStorage.getItem(key)
        if (data)
        {
            try 
            {
                savedCities.value = JSON.parse(data)
            }
            catch {}
        }
        else
            savedCities.value = []
    }

    const persistSavedCities = (userId) => {
        const key = `savedCities_${userId}`
        localStorage.setItem(key, JSON.stringify(savedCities.value))
    }

    const addCity = (userId, cityName) => {
        if (!savedCities.value.includes(cityName))
        {
            savedCities.value.push(cityName)
            persistSavedCities(userId)
        }
    }

    const removeCity = (userId, cityName) => {
        savedCities.value = savedCities.value.filter(c => c !== cityName)
        persistSavedCities(userId)
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