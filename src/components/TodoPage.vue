<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type QueryFunction,
} from '@tanstack/vue-query'
import axios from 'axios'
import localforage from 'localforage'
import API from '../utilities/api'

import TodoForm from './TodoForm.vue'
import SearchInput from './SearchInput.vue'
import FilterButtons from './FilterButtons.vue'
import TodoList from './TodoList.vue'

import type { Todo, TodosResponse } from './types'

const todosPerPage = 10
const queryClient = useQueryClient()
const route = useRoute()
const router = useRouter()

localforage.config({
  name: 'todoApp',
  storeName: 'todos',
})

const getTodos: QueryFunction<TodosResponse> = async ({ queryKey }) => {
  const [, page] = queryKey as readonly [string, number]

  const cached = await localforage.getItem<TodosResponse>(`todos-page-${page}`)
  if (cached) return cached

  const res = await axios.get(`${API}?limit=${todosPerPage}&skip=${page * todosPerPage}`)

  const data: TodosResponse = { todos: res.data.todos, total: res.data.total }

  await localforage.setItem(`todos-page-${page}`, data)
  return data
}

const newTodo = ref('')

const currentPage = computed(() => Number(route.query.page ?? 1))
const zeroBasedPage = computed(() => currentPage.value - 1)
const filter = computed(() => (route.query.filter as string) || 'all')
const searchKeyword = ref((route.query.search as string) || '')

const { data, isLoading, isError, error } = useQuery<TodosResponse, Error>({
  queryKey: ['todos', zeroBasedPage],
  queryFn: getTodos,
  placeholderData: keepPreviousData,
})

const totalTodos = computed(() => data.value?.total ?? 0)
const totalPages = computed(() => Math.ceil(totalTodos.value / todosPerPage))

const paginationRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1
  const range: (number | string)[] = []

  range.push(1)

  if (current - delta > 2) {
    range.push('…')
  }

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current + delta < total - 1) {
    range.push('…')
  }

  if (total > 1) {
    range.push(total)
  }

  return range
})

type MutationContext = { previousData: TodosResponse }

const createTodo = useMutation<Todo, Error, Todo, MutationContext>({
  mutationFn: async (newTodo) => {
    const res = await axios.post(API, {
      todo: newTodo.todo,
      completed: newTodo.completed,
      userId: 1,
    })
    return res.data
  },
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos', zeroBasedPage.value] })
    const previousData = queryClient.getQueryData<TodosResponse>([
      'todos',
      zeroBasedPage.value,
    ]) ?? { todos: [], total: 0 }

    const newItem: Todo = { ...newTodo, id: Date.now() }
    const newData: TodosResponse = {
      todos: [newItem, ...previousData.todos],
      total: previousData.total + 1,
    }

    queryClient.setQueryData(['todos', zeroBasedPage.value], newData)
    await localforage.setItem(`todos-page-${zeroBasedPage.value}`, newData)

    return { previousData }
  },
  onError: (_err, _newTodo, context) => {
    if (context) queryClient.setQueryData(['todos', zeroBasedPage.value], context.previousData)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos', zeroBasedPage.value] })
  },
})

const updateTodo = useMutation<Todo, Error, Todo, MutationContext>({
  mutationFn: async ({ id, ...updatedTodo }) => {
    const res = await axios.put(`${API}/${id}`, updatedTodo)
    return res.data
  },
  onMutate: async (updatedTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos', zeroBasedPage.value] })
    const previousData = queryClient.getQueryData<TodosResponse>([
      'todos',
      zeroBasedPage.value,
    ]) ?? { todos: [], total: 0 }

    const updatedTodos = previousData.todos.map((todo) =>
      todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo,
    )
    const newData: TodosResponse = { todos: updatedTodos, total: previousData.total }

    queryClient.setQueryData(['todos', zeroBasedPage.value], newData)
    await localforage.setItem(`todos-page-${zeroBasedPage.value}`, newData)

    return { previousData }
  },
  onError: (_err, _updatedTodo, context) => {
    if (context) queryClient.setQueryData(['todos', zeroBasedPage.value], context.previousData)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos', zeroBasedPage.value] })
  },
})

const deleteTodo = useMutation<void, Error, number, MutationContext>({
  mutationFn: async (id) => {
    await axios.delete(`${API}/${id}`)
  },
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['todos', zeroBasedPage.value] })
    const previousData = queryClient.getQueryData<TodosResponse>([
      'todos',
      zeroBasedPage.value,
    ]) ?? { todos: [], total: 0 }

    const updatedTodos = previousData.todos.filter((todo) => todo.id !== id)
    const newData: TodosResponse = { todos: updatedTodos, total: previousData.total - 1 }

    queryClient.setQueryData(['todos', zeroBasedPage.value], newData)
    await localforage.setItem(`todos-page-${zeroBasedPage.value}`, newData)

    return { previousData }
  },
  onError: (_err, _id, context) => {
    if (context) queryClient.setQueryData(['todos', zeroBasedPage.value], context.previousData)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos', zeroBasedPage.value] })
  },
})

const filteredTodos = computed(() =>
  (data.value?.todos || []).filter((todo) => {
    const matchesFilter =
      filter.value === 'all' ? true : filter.value === 'active' ? !todo.completed : todo.completed

    const matchesSearch =
      !searchKeyword.value.trim() ||
      todo.todo.toLowerCase().includes(searchKeyword.value.toLowerCase())

    return matchesFilter && matchesSearch
  }),
)

function handleSubmit() {
  // e.preventDefault()
  if (!newTodo.value.trim()) return
  createTodo.mutate({ id: Date.now(), todo: newTodo.value, completed: false })
  newTodo.value = ''
}

function handleUpdate(todo: Todo) {
  updateTodo.mutate(todo)
}

function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this todo?')) {
    deleteTodo.mutate(id)
  }
}

function goToPage(page: number) {
  router.push({ query: { ...route.query, page } })
}

watch(searchKeyword, (newValue) => {
  if (newValue !== route.query.search) {
    router.push({
      query: { ...route.query, search: newValue, page: 1 },
    })
  }
})

watch(
  () => route.query.search,
  (newSearch) => {
   if (newSearch !== searchKeyword.value) {
      searchKeyword.value = (newSearch as string) || ""
    }
  }
)
</script>

<template>
  <section
    role="region"
    aria-label="Todo Page"
    class="w-screen flex flex-col items-center gap-6 max-w-2xl mx-auto"
  >
    <TodoForm
      :newTodo="newTodo"
      :setNewTodo="(val) => (newTodo = val)"
      :handleSubmit="handleSubmit"
    />

    <section class="filter-search flex gap-2 justify-center w-80 md:w-100">
      <FilterButtons />
      <SearchInput v-model="searchKeyword" />
    </section>

    <section role="region" aria-label="Todo List">
      <div v-if="isLoading" role="status" aria-live="polite" aria-busy="true">
        <span class="animate-spin">⏳</span>
      </div>

      <div v-else-if="isError" role="alert" class="text-destructive">
        Error loading todos: {{ error?.message }}
      </div>

      <TodoList
        v-else
        :todoList="filteredTodos"
        :onUpdate="handleUpdate"
        :onDelete="handleDelete"
      />
    </section>

    <nav class="flex items-center flex-wrap justify-center gap-2 text-center mb-8">
      <button
        :disabled="currentPage <= 1"
        class="px-3 py-1 border rounded"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>

      <span v-for="page in paginationRange" :key="page">
        <button
          v-if="page !== '…'"
          class="px-3 py-1 border rounded"
          :class="{ 'bg-primary text-background': page === currentPage }"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
        <span v-else class="px-3 py-1">…</span>
      </span>

      <!-- Next -->
      <button
        :disabled="currentPage >= totalPages"
        class="px-3 py-1 border rounded"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </section>
</template>
