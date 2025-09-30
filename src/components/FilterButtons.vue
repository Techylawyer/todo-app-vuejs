<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const current = computed(() => (route.query.filter as string) || 'all')

function setFilter(filter: string) {
  router.push({
    query: {
      ...route.query,
      filter,
      page: 1,
    },
  })
}
</script>

<template>
  <section class="filter-section flex gap-2 justify-center" role="region" aria-label="Filter Todos">
    <Button
      variant="default"
      size="default"
      class="btn btn-active btn-primary cursor-pointer"
      @click="setFilter('all')"
      :disabled="current === 'all'"
    >
      All
    </Button>

    <Button
      variant="default"
      size="default"
      class="btn btn-active btn-primary cursor-pointer"
      @click="setFilter('active')"
      :disabled="current === 'active'"
    >
      Active
    </Button>

    <Button
      variant="default"
      size="default"
      class="btn btn-active btn-primary cursor-pointer"
      @click="setFilter('completed')"
      :disabled="current === 'completed'"
    >
      Completed
    </Button>
  </section>
</template>
