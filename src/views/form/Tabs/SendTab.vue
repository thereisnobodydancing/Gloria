<!-- 发起申请 -->
<template>
  <n-spin :show="false">
    <div 
      class="w-full overflow-y-scroll" 
      :style="{height: `${clientHeight - 150}px`}"
    >
      <n-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-placement="left"
        require-mark-placement="left"
        class="px-10 mt-4 w-7/12"
        label-width="120"
      >
        <n-form-item 
          v-for="(item, index) in formList" 
          :key="index" 
          path="item.options.id"
          :label="`${item.options.name}：`"
        >
          <!-- 单行输入文本 -->
          <template v-if="item.type === 'input'">
            <div
              :class="{
                'w-1/3': item.options.width === '1/3',
                'w-2/3': item.options.width === '2/3',
                'w-full': item.options.width === '3/3'
              }"
            >
              <n-input 
                v-model:value="form[item.options.id]" 
                type="text" 
                :placeholder="item.options.placeholder" 
                clearable 
              />
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 多行输入文本 -->
          <template v-if="item.type === 'textarea'">
            <div
              :class="{
                'w-1/3': item.options.width === '1/3',
                'w-2/3': item.options.width === '2/3',
                'w-full': item.options.width === '3/3'
              }"
            >
              <n-input 
                v-model:value="form[item.options.id]" 
                type="textarea" 
                :placeholder="item.options.placeholder" 
                :autosize="{minRows: 3}" 
                clearable 
              />
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 数字输入文本 -->
          <template v-if="item.type === 'inputNumber'">
            <div
              :class="{
                'w-1/3': item.options.width === '1/3',
                'w-2/3': item.options.width === '2/3',
                'w-full': item.options.width === '3/3'
              }"
            >
              <n-input-number
                v-model:value="form[item.options.id]" 
                :placeholder="item.options.placeholder" 
                :min="item.options.useMin ? item.options.min : undefined"
                :max="item.options.useMax ? item.options.max : undefined"
                clearable
              />
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 选择器 -->
          <template v-if="item.type === 'select'">
            <div
              :class="{
                'w-1/3': item.options.width === '1/3',
                'w-2/3': item.options.width === '2/3',
                'w-full': item.options.width === '3/3'
              }"
            >
              <n-select 
                v-model:value="form[item.options.id]" 
                :options="item.options.list" 
                :placeholder="item.options.placeholder"
                :multiple="item.options.multiple"
                clearable
              />
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 单选框 -->
          <template v-if="item.type === 'radio'">
            <div
              :class="{
                'w-1/3': item.options.width === '1/3',
                'w-2/3': item.options.width === '2/3',
                'w-full': item.options.width === '3/3'
              }"
            >
              <n-radio-group v-model:value="form[item.options.id]" name="radiogroup" class="leading-8">
                <n-space>
                  <n-radio 
                    v-for="item in item.options.list" 
                    :key="item.value" 
                    :value="item.value"
                  >
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 多选框 -->
          <template v-if="item.type === 'checkbox'">
            <div
              :class="{
                'w-1/3': item.options.width === '1/3',
                'w-2/3': item.options.width === '2/3',
                'w-full': item.options.width === '3/3'
              }"
            >
              <n-checkbox-group>
                <n-space item-style="display: flex">
                  <n-checkbox 
                    v-for="i in item.options.list" 
                    :key="i.value" 
                    :value="i.value"
                  >
                    {{ i.label }}
                  </n-checkbox>
                </n-space>
              </n-checkbox-group>
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 选择日期 -->
          <template v-if="item.type === 'datePicker'">
            <div>
              <n-date-picker
                :type="item.options.type" 
                :start-placeholder="datePlaceholder[item.options.type] ? datePlaceholder[item.options.type].start : null" 
                :end-placeholder="datePlaceholder[item.options.type] ? datePlaceholder[item.options.type].end : null"
              />
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>

          <!-- 上传 -->
          <template v-if="item.type === 'upload'">
            <div class="w-full">
              <n-upload 
                action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                :list-type="item.options.type"
              >
                <n-button v-if="item.options.type==='text'">{{ item.options.btnText }}</n-button>
              </n-upload>
              <p v-if="item.options.desc"  class="mt-1 text-xs text-gray-400">{{ item.options.desc }}</p>
            </div>
          </template>
        </n-form-item>
      </n-form>
    </div>
  </n-spin>
</template>

<script setup>
import api from '/src/api/index.js'

const route = useRoute()
const clientHeight = ref(document.documentElement.clientHeight)
const formRef = ref()
const formList = ref([])
const form = ref({})
const rules = ref({})
const datePlaceholder = {
  daterange: { start: '开始日期', end: '结束日期' },
  datetimerange: { start: '开始日期时间', end: '结束日期时间' },
  monthrange: { start: '开始月份', end: '结束月份' },
  yearrange: { start: '开始年份', end: '结束年份' },
  quarterrange: { start: '开始季度', end: '结束季度' },
}

const getData = (id) => {
  api.get('/process/getProcessTemplate', { templateId: id }).then((res) => {
    formList.value = JSON.parse(res.data.data.form)
    JSON.parse(res.data.data.form).forEach((item, index) => {
      if(['textarea', 'input', 'inputPhone', 'inputId'].includes(item.type)) form.value[item.options.id] = ''
      if(['inputNumber', 'select', 'radio', 'checkbox'].includes(item.type)) form.value[item.options.id] = null
    })
  })
}
onMounted(() => getData(route.params.id))
watch(() => route.params.id, newId => {
  getData(newId)
})
</script>
