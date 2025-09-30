<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

defineProps<{
  newTodo: string
  setNewTodo: (val: string) => void
  handleSubmit: () => void
}>()
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex justify-center items-center w-80 md:w-100">
    <Input
      :value="newTodo"
      class="rounded-r-none"
      autofocus
      type="text"
      name="new-todo"
      placeholder="What do you want to do?"
      aria-label="Enter New Todo"
      @input="setNewTodo(($event.target as HTMLInputElement).value)"
    />
    <Button variant="default" size="default" type="submit" class="rounded-l-none cursor-pointer">
      Create Todo
    </Button>
  </form>
</template>
