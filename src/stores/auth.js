import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore("auth", () => {
    const user = ref(null)
    const token = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const isLoggedIn = computed(() => {
        return !!user.value && !!token.value
    })

    const userName = computed(() => {
        return user.value?.name || user.value?.email || "Пользователь"
    })

    const userCity = computed(() => {
        return user.value?.city || ""
    })

    const userEmail = computed(() => {
        return user.value?.email || ""
    })

    const validateEmail = (email) => {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
        return re.test(email)
    }

    const validatePassword = (password) => {
        return password && password.length >= 6
    }

    const validateName = (name) => {
        return name && name.trim().length > 0
    }

    const register = async (userData) => {
        loading.value = true
        error.value = null

        if (!validateName(userData.name))
        {
            error.value = "Поле 'имя' обязательно должно быть заполнено"
            loading.value = false
            return false
        }

        if (!validateEmail(userData.email))
        {
            error.value = "Введите корректный email адрес"
            loading.value = false
            return false
        }

        if (!validatePassword(userData.password))
        {
            error.value = "Пароль должен содержать минимум 6 символов"
            loading.value = false
            return false
        }

        if (userData.password !== userData.confirmPassword)
        {
            error.value = "Пароли не совпадают"
            loading.value = false
            return false
        }

        try
        {
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Имитация API запроса

            const users = JSON.parse(localStorage.getItem("users") || "[]")
            if (users.some(u => u.email === userData.email))
            {
                error.value = "Пользователь с таким email уже существует"
                loading.value = false
                return false
            }

            const newUser = {
                id: Date.now(),
                name: userData.name.trim(),
                email: userData.email,
                password: userData.password,
                city: userData.city || "",
                createdAt: new Date().toISOString()
            }

            users.push(newUser)
            localStorage.setItem("users", JSON.stringify(users))

            user.value = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                city: newUser.city || ""
            }

            token.value = "fake-jwt-token-" + Date.now()

            localStorage.setItem("auth", JSON.stringify({
                user: user.value,
                token: token.value
            }))

            loading.value = false
            return true
        }
        catch (e)
        {
            error.value = e.message || "Ошибка регистрации"
            loading.value = false
            return false
        }
    }

    const login = async (existUser) => {
        loading.value = true
        error.value = null

        if (!validateEmail(existUser.email))
        {
            error.value = "Введите корректный email адрес"
            loading.value = false
            return false
        }

        if (!validatePassword(existUser.password))
        {
            error.value = "Введите пароль (минимум 6 символов)"
            loading.value = false
            return false
        }

        try
        {
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Имитация API запроса

            const users = JSON.parse(localStorage.getItem("users") || "[]")
            const foundUser = users.find(u => u.email === existUser.email && u.password === existUser.password)
            if (!foundUser)
            {
                error.value = "Неверный email или пароль"
                loading.value = false
                return false
            }

            user.value = {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                city: foundUser.city || ""
            }

            token.value = "fake-jwt-token-" + Date.now()

            localStorage.setItem("auth", JSON.stringify({
                user: user.value,
                token: token.value
            }))

            loading.value = false
            return true
        }
        catch (e)
        {
            error.value = e.message || "Ошибка авторизации"
            loading.value = false
            return false
        }
    }

    const updateCity = (city) => {
        if (!user.value)
            return
        user.value.city = city

        localStorage.setItem("auth", JSON.stringify({
            user: user.value,
            token: token.value
        }))

        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const index = users.findIndex(u => u.id === user.value.id)
        if (index !== -1)
        {
            users[index].city = city
            localStorage.setItem("users", JSON.stringify(users))
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem("auth")
    }

    const checkAuth = () => {
        const saved = localStorage.getItem("auth")
        if (saved)
        {
            try
            {
                const data = JSON.parse(saved)
                if (data.user && data.token)
                {
                    user.value = data.user
                    token.value = data.token
                    return true
                }
            }
            catch
            {
                localStorage.removeItem("auth")
            }
        }
        return false
    }

    const clearError = () => {
        error.value = null
    }

    checkAuth()

    return {
        user,
        token,
        loading,
        error,
        isLoggedIn,
        userName,
        userEmail,
        userCity,
        validateEmail,
        validatePassword,
        validateName,
        register,
        login,
        updateCity,
        logout,
        checkAuth,
        clearError
    }
})

export default useAuthStore