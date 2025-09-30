<script setup lang="ts">
import { Input } from "@/components/ui/input"


const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <section role="region" aria-label="Search Todos">
    <Input
      class="rounded-full"
      type="text"
      placeholder="Search todos..."
      name="search-todo"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </section>
</template>
