<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useQueryClient } from "@tanstack/vue-query"
import { FaArrowLeft } from "vue-icons-plus/fa"
import { Button } from "@/components/ui/button"
import NotFoundPage from "./NotFound.vue"

interface Todo {
  id: number
  todo: string
  completed: boolean
  userId?: number
}

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

function findTodo(): Todo | null {
  const allQueries = queryClient.getQueryCache().findAll({ queryKey: ["todos"] })

  for (const query of allQueries) {
    const data = query.state.data as { todos: Todo[] } | undefined
    if (!data) continue
    const match = data.todos.find((t) => t.id === Number(route.params.todoId))
    if (match) return match
  }
  return null
}

const todo = findTodo()
</script>

<template>
  <NotFoundPage v-if="!todo" />

  <section
    v-else
    role="region"
    aria-label="Todo Item Detail"
    class="todoItemDetail flex flex-col item-center gap-5 p-6 w-full max-w-lg mx-auto bg-card rounded-2xl shadow"
  >
    <p><strong>Task ID:</strong> {{ todo.id }}</p>
    <p><strong>Task:</strong> {{ todo.todo }}</p>
    <p><strong>Completed:</strong> {{ todo.completed ? "Yes" : "No" }}</p>
    <p><strong>User ID:</strong> {{ todo.userId || 1 }}</p>

    <Button
      variant="default"
      size="default"
      class="w-50 cursor-pointer"
      @click="router.push('/todos')"
    >
      <FaArrowLeft /> Back to List
    </Button>
  </section>
</template>
