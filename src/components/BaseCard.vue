<template>
  <n-spin 
    :show="props.loading" 
    class="w-full h-full"
  >
    <div class="w-full h-full flex flex-col bg-white rounded shadow">
      <!-- title -->
      <div class="flex-shrink-0 w-full border-b px-6 rounded-t">
        <div class="w-full h-16 flex items-center">
          <h2 class="flex-shrink-0 text-lg font-bold text-gray-900/70 leading-[4rem]">{{ props.title }}</h2>
          <slot name="title-right" />
        </div>
        <slot name="title-bottom" />
      </div>
      <!-- body -->
      <div class="grow w-full rounded-b">
        <slot />
      </div>
    </div>
  </n-spin>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
.n-spin-content {
  @apply w-full h-full
}
</style>