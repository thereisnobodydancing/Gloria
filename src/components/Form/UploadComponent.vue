<!-- 上传 -->
<template>
  <div class="w-full">
    <base-upload 
      :action="props.options.type === 'text' ? `${baseUrl}/process/uploadFile` : `${baseUrl}/process/uploadPicture`"
      :file-list="form[props.options.id]"
      :type="props.options.type"
      @change="changeFileUpload"
    >
      <template v-if="props.options.type === 'text'">
        <n-button>上传文件</n-button>
      </template>
    </base-upload>
    <p v-if="props.options.desc"  class="mt-1 text-xs text-gray-400">{{ props.options.desc }}</p>
  </div>
</template>

<script setup>
import useFormStore from '/src/store/form.js'

const { form } = toRefs(useFormStore())
const props = defineProps({
  options: Object
})
const baseUrl = import.meta.env.VITE_APP_URL

// 上传文件
const changeFileUpload = (fileList) => form.value[props.options.id] = fileList
</script>