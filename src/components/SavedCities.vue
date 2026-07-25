<script setup>
defineProps({
    cities: {
        type: Array,
        required: true
    }
})

defineEmits([
    'select',
    'remove'
])
</script>

<template>
    <div class="saved-cities">
        <h3>Сохранённые города</h3>
        <ul v-if="cities.length">
            <li v-for="(city, index) in cities" :key="city">
                <span>{{ index + 1 }}</span>
                <span @click="$emit('select', city)">{{ city }}</span>
                <button @click.stop="$emit('remove', city)">X</button>
            </li>
        </ul>
        <p v-else>Нет сохранённых городов</p>
    </div>
</template>

<style scoped src="../style.css"></style>