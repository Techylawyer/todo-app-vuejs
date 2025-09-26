<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { Button } from "@/components/ui/button"

const route = useRoute()
const router = useRouter()

const current = (route.query.filter as string) || "all"

function setFilter(filter: string) {
  router.push({
    query: {
      ...route.query,
      filter,
    },
  })
}
</script>

<template>
  <section
    class="filter-section flex gap-2 justify-center"
    role="region"
    aria-label="Filter Todos"
  >
    <Button
      variant="default"
      size="default"
      class="btn btn-active btn-primary cursor-pointer"
      :disabled="current === 'all'"
      @click="setFilter('all')"
    >
      All
    </Button>

    <Button
      variant="default"
      size="default"
      class="btn btn-active btn-primary cursor-pointer"
      :disabled="current === 'active'"
      @click="setFilter('active')"
    >
      Active
    </Button>

    <Button
      variant="default"
      size="default"
      class="btn btn-active btn-primary cursor-pointer"
      :disabled="current === 'completed'"
      @click="setFilter('completed')"
    >
      Completed
    </Button>
  </section>
</template>
