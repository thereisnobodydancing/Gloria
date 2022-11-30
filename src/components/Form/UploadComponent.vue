<!-- 上传 -->
<template>
  <div class="w-full">
    <base-upload 
      :action="props.options.type === 'text' ? `${baseUrl}/process/uploadFile` : `${baseUrl}/process/uploadPicture`"
      :file-list="list"
      :type="props.options.type"
      @change="handleUpdate" 
    >
      <template v-if="props.options.type === 'text'">
        <n-button>上传文件</n-button>
      </template>
    </base-upload>
    <p v-if="props.options.desc"  class="mt-1 text-xs text-gray-400">{{ props.options.desc }}</p>
  </div>
</template>

<script setup>
const emit = defineEmits(['change'])
const props = defineProps({
  options: Object
})
const list = ref([])
const baseUrl = import.meta.env.VITE_APP_URL
const handleUpdate = (list) => emit('change', list)
</script>