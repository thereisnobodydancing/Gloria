<template>
  <n-spin
    :show="loading" 
    class="w-full h-full relative"
  >
    <slot v-if="localList.length === 0 && !loading" name="empty" />
    <slot v-if="localList.length > 0" :list="localList" />
    <div 
      v-if="localList.length > 0"
      class="px-2 pb-4 pt-6 w-full flex justify-end bg-white/80"
    >
      <n-pagination
        v-model:page="currentPage"
        :page-count="Math.ceil(total/props.size)"
        @update:page="handleCurrentChange"
      />
    </div>
  </n-spin>
</template>

<script setup>
import api from '/src/api/index.js'
import { debounce, pickBy } from 'lodash'

const emit = defineEmits(['changePage'])
const  props = defineProps({
  height: {
    type: Number,
    default: 400
  },
  size: {
    type: Number,
    default: 8
  },
  url: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => {}
  },
  auto: {
    type: Boolean,
    default: true
  }
})
const loading = ref(true)
const currentPage = ref(1)
const localList = ref([])
const total = ref(0)

const askApi = debounce((more = true) => {
  loading.value = true
  let newParams = {}
  if(!more) currentPage.value = 1
  Object.assign(newParams, props.params, { page: currentPage.value, pageSize: props.size })
  api.get(props.url, pickBy(newParams)).then((res) => {
    if(res.data.code === 20000) {
      total.value = res.data.data.total
      localList.value = res.data.data.data ? res.data.data.data : []
    } else {
      total.value = 0
      localList.value = []
    }
    setTimeout(() => loading.value = false, 250)
  })
  setTimeout(() => loading.value = false, 250)
}, 100, { leading: false, trailing: true})

onMounted(() => { if(props.auto) askApi()})
onUnmounted(() => askApi.cancel())

watch(() => props.params, (value) => {
  console.log(value)
  askApi(false)
}, {
  deep: true
})

watch(() => props.size, value => {
  askApi()
})

watch(() => props.url, value => {
  loading.value = true
  localList.value = []
  askApi(false)
})

const handleCurrentChange = function(page) {
  askApi()
  emit('changePage')
}

defineExpose({
  askApi,
  total
})
</script>