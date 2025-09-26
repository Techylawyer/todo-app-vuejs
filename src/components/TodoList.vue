<script setup lang="ts">
import TodoListItem from "./TodoListItem.vue"

interface Todo {
  id: number
  todo: string
  completed: boolean
}

defineProps<{
  todoList: Todo[]
  onUpdate: (todo: Todo) => void
  onDelete: (id: number) => void
}>()
</script>

<template>
  <ul>
    <TodoListItem
      v-for="todo in todoList"
      :key="todo.id"
      :todo="todo"
      :onUpdate="onUpdate"
      :onDelete="onDelete"
    />
  </ul>
</template>
