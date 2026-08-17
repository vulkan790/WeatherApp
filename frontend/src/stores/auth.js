import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const API_URL = "https://weatherapp-vrmn.onrender.com"

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
        return password && password.length >= 8
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
            error.value = "Пароль должен содержать минимум 8 символов"
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
            const response = await fetch(`${API_URL}/users/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name.trim(),
                    city: userData.city || ""
                })
            })

            if (!response.ok)
            {
                const data = await response.json()
                error.value = data.detail || "Ошибка регистрации"
                loading.value = false
                return false
            }

            const newUser = await response.json()
            const loginSuccess = await login({
                email: userData.email,
                password: userData.password
            })

            loading.value = false
            return loginSuccess
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
            error.value = "Введите пароль (минимум 8 символов)"
            loading.value = false
            return false
        }

        try
        {
            const formData = new URLSearchParams()
            formData.append("username", existUser.email)
            formData.append("password", existUser.password)

            const response = await fetch(`${API_URL}/users/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            })

            if (!response.ok) 
            {
                const data = await response.json()
                error.value = data.detail || "Неверный email или пароль"
                loading.value = false
                return false
            }

            const data = await response.json()
            token.value = data.access_token

            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)

            const userResponse = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                },
            })

            if (!userResponse.ok) 
            {
                error.value = "Не удалось получить данные пользователя"
                loading.value = false
                return false
            }

            user.value = await userResponse.json()
            
            localStorage.setItem('user', JSON.stringify(user.value))
            
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

    const updateCity = async (city) => {
        if (!user.value)
            return
        
        try
        {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`,
                },
                body: JSON.stringify({ city }),
            })

            if (!response.ok)
                throw new Error('Не удалось обновить город')

            user.value = await response.json()
            localStorage.setItem('user', JSON.stringify(user.value))
        }
        catch (e) 
        {
            error.value = e.message
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
    }

    const checkAuth = async () => {
        const savedToken = localStorage.getItem('access_token')
        const savedUser = localStorage.getItem('user')
        if (savedToken && savedUser)
        {
            try
            {
                token.value = savedToken
                user.value = JSON.parse(savedUser)

                const response = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token.value}`,
                    },
                })

                if (!response.ok) 
                {
                    logout()
                    return false
                }
                
                return true
            }
            catch
            {
                logout()
                return false
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