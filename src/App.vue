<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onErrorCaptured } from 'vue'
import { ref } from 'vue'
import ErrorFallback from './components/ErrorFallback.vue'

import './styles/App.css'


const router = useRouter()


const hasError = ref(false)

interface ErrorInfo {
  err: unknown
  info: string
}

const errorInfo = ref<ErrorInfo | null>(null)

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorInfo.value = { err, info }
  return false
})

function resetError() {
  hasError.value = false
  errorInfo.value = null
  router.push('/todos')
}
</script>

<template>
  <main
    data-region="main"
    class="min-h-screen flex flex-col justify-start gap-10 bg-secondary p-5"
  >
    <h1 class="text-center text-4xl font-extrabold tracking-tight text-primary mt-6 mb-8">
      Todo App
    </h1>


   <ErrorFallback
  v-if="hasError"
  :error="{ message: errorInfo?.info ?? 'Something went wrong' }"
  @reset="resetError"
/>
    <router-view v-else class="w-full max-w-3xl flex justify-center"/>
  </main>
</template>
