<script setup>
import { computed } from "vue"

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["save"])

const formattedDate = computed(() => {
    const now = new Date(props.data.time)
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
    const dayName = days[now.getDay()]
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    return `${dayName} ${day}.${month}.${year}`
})

const save = () => emit('save')
</script>

<template>
    <div class="weather-card">
        <slot name="header" :data="data">
            <div class="header">
                <div>
                    <h2>{{ data.city }}</h2>
                    <p>{{ formattedDate }}</p>
                </div>
                <div>
                    <span>{{ data.icon }}</span>
                    <span>{{ data.temp }}°C</span>
                </div>
            </div>
        </slot>
        <slot name="description" :data="data">
            <p>{{ data.description }}</p>
        </slot>
        <slot name="details" :data="data">
            <div class="details">
                <div>
                    <span>Влажность</span>
                    <span>{{ data.humidity }}%</span>
                </div>
                <div>
                    <span>Осадки</span>
                    <span>{{ data.precipitation }}%</span>
                </div>
                <div>
                    <span>Ветер</span>
                    <span>{{ data.wind }} м/с</span>
                </div>
            </div>
        </slot>
        <slot name="actions" :data="data" :saved="saved" :save="save">
            <button v-if="!saved" @click="save" class="save-button">Сохранить</button>
            <button v-else disabled class="save-button">Сохранено</button>
        </slot>
    </div>
</template>

<style scoped src="../style.css"></style>