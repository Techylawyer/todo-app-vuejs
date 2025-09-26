<script setup lang="ts">
import { RouterLink } from "vue-router"
import { Button } from "@/components/ui/button"
import { FaArrowLeft } from "vue-icons-plus/fa"
</script>

<template>
  <aside class="flex flex-col gap-5 text-center">
    <h1
      class="pt-5 text-3xl font-semibold tracking-tight first:mt-0 text-destructive"
    >
      404 - Page Not Found
    </h1>

    <p class="text-destructive mb-10">
      Sorry, the page you are looking for does not exist.
    </p>

    
    <RouterLink to="/" class="mx-auto w-50">
      <Button variant="default" size="default" class="cursor-pointer w-full flex items-center justify-center gap-2">
        <FaArrowLeft />
        Go back to Home
      </Button>
    </RouterLink>
  </aside>
</template>
