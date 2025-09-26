<script setup lang="ts">
import { Input } from "@/components/ui/input"

defineProps<{
  searchKeyword: string
  onSearchChange: (value: string) => void
}>()
</script>

<template>
  <section role="region" aria-label="Search Todos">
    <Input
      class="rounded-full"
      type="text"
      placeholder="Search todos..."
      name="search-todo"
      :value="searchKeyword"
      @input="onSearchChange(($event.target as HTMLInputElement).value)"
    />
  </section>
</template>
