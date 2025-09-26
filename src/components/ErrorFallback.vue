<script setup lang="ts">
import { useRouter } from 'vue-router'


interface Props {
  error: { message?: string }
}
const props = defineProps<Props>()


const emit = defineEmits<{ (e: 'reset'): void }>()

const router = useRouter()

function handleReset() {
  router.push('/todos')
  emit('reset')
}
</script>

<template>
  <aside
    role="alert"
    class="flex flex-col p-10 text-center h-screen bg-secondary"
  >
    <h2 class="text-destructive text-2xl font-bold">
      There was a problem loading this page:
    </h2>

    <pre class="whitespace-pre-wrap m-10 text-xl">
      {{ props.error?.message }}
    </pre>

    <button
      class="w-50 mx-auto cursor-pointer px-4 py-2 rounded bg-primary text-white hover:opacity-80"
      @click="handleReset"
    >
      Go to Home Page
    </button>
  </aside>
</template>
