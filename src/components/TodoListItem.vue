<script setup lang="ts">
import { ref, watch } from "vue"
import { RouterLink } from "vue-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaRegTrashAlt, FaEdit, FaCheckCircle, FaTimesCircle } from "vue-icons-plus/fa"


interface Todo {
  id: number
  todo: string
  completed: boolean
}

const props = defineProps<{
  todo: Todo
  onUpdate: (todo: Todo) => void
  onDelete: (id: number) => void
}>()


const isEditing = ref(false)
const editValue = ref(props.todo.todo)


watch(
  () => props.todo.todo,
  (newVal) => {
    editValue.value = newVal
  }
)

function handleSave() {
  props.onUpdate({
    id: props.todo.id,
    todo: editValue.value,
    completed: props.todo.completed,
  })
  isEditing.value = false
}

function handleCancelClick() {
  editValue.value = props.todo.todo
  isEditing.value = false
}

function handleCancelKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    editValue.value = props.todo.todo
    isEditing.value = false
  }
}

function handleToggle() {
  props.onUpdate({
    id: props.todo.id,
    todo: props.todo.todo,
    completed: !props.todo.completed,
  })
}
</script>

<template>

  <li v-if="isEditing">
    <form
      class="flex justify-between items-center gap-8"
      @submit.prevent="handleSave"
    >
      <Input
        class="w-full"
        autofocus
        type="text"
        name="edit-todo"
        v-model="editValue"
        @keydown="handleCancelKey"
      />
      <div class="btn-group flex justify-between gap-5">
        <Button
          variant="default"
          size="icon"
          class="size-6 cursor-pointer"
          type="submit"
          aria-label="Save Todo"
        >
          <FaCheckCircle />
        </Button>
        <Button
          variant="default"
          size="icon"
          class="size-6 cursor-pointer"
          type="button"
          aria-label="Cancel Editing"
          @click="handleCancelClick"
        >
          <FaTimesCircle />
        </Button>
      </div>
    </form>
  </li>


  <li
    v-else
    :style="props.todo.completed ? { textDecoration: 'line-through' } : {}"
    class="flex gap-5 items-center justify-between"
  >
    <div class="flex items-center">
      <input
        class="h-5 w-5 accent-primary"
        type="checkbox"
        name="check-completed"
        :checked="props.todo.completed"
        @change="handleToggle"
      />
      <RouterLink :to="`./todos/${props.todo.id}`">
        <p class="hover:bg-blue p-2 w-full">{{ props.todo.todo }}</p>
      </RouterLink>
    </div>

    <section class="btn-wrap flex gap-5">
      <Button
        variant="default"
        size="icon"
        class="size-6 cursor-pointer"
        aria-label="Edit Todo"
        @click="isEditing = true"
      >
        <FaEdit />
      </Button>
      <Button
        variant="default"
        size="icon"
        class="size-6 cursor-pointer"
        aria-label="Delete Todo"
        @click="props.onDelete(props.todo.id)"
      >
        <FaRegTrashAlt />
      </Button>
    </section>
  </li>
</template>
