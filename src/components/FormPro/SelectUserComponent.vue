<!-- 选择成员 -->
<template>
  <div class="w-full">
    <div class="w-full flex flex-wrap">
      <div
        v-for="(item, index) in form[props.options.id].optionList"
        :key="index"
        class="mr-6 mb-8 w-10 h-10 rounded-md cursor-pointer hover:opacity-90 relative"
        :class="{'bg-primary': !item.picture}"
        @click="showCard(item.id)"
      >
        <!-- 头像 -->
        <base-avatar :image="item.picture" :name="item.name" />
        <!-- 删除符号 -->
        <div
          class="absolute -top-3 -right-4" 
          @click.prevent.stop="removeUser(item.key, item.id, index)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-gray-300 hover:text-red-500">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="mt-1 text-xs text-gray-500 line-1">{{ item.name }}</p>
      </div>
      <button
        v-if="!props.options.useMax || props.options.useMax && props.options.max > form[props.options.id].optionList.length"
        aria-label="选择成员"
        class="w-10 h-10 rounded-md border border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
        @click="showSelUserModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-auto">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </button>
    </div>
    <p 
      v-if="props.options.desc"
      class="text-xs text-gray-400"
      :class="form[props.options.id].optionList.length > 0 ? '-mt-2' : 'mt-2'"
    >
      {{ props.options.desc }}
    </p>
    <!-- 选择人员Modal -->
    <add-user-modal 
      ref="addUserRef" 
      :max="props.options.useMax ? props.options.max : null"
      @confirm="changeUser" 
    />
    <!-- 名片Modal -->
    <business-card-modal ref="cardRef" />
  </div>
</template>

<script setup>
import useFormStore from '/src/store/form.js'

const { form } = toRefs(useFormStore())
const props = defineProps({
  options: Object
})

/******* 选择部门负责人 *******/
const addUserRef = ref()
// 弹出人员弹窗
const showSelUserModal = function() {
  addUserRef.value.showModal(form.value[props.options.id].optionList, form.value[props.options.id].keyList, form.value[props.options.id].idList)
}
// 人员变化
const changeUser = function({options, keys, ids}) {
  form.value[props.options.id].optionList = options
  form.value[props.options.id].keyList = keys
  form.value[props.options.id].idList = ids
}
// 删除人员
const removeUser = function(key, id, index) {
  form.value[props.options.id].keyList.splice(form.value[props.options.id].keyList.indexOf(key), 1)
  form.value[props.options.id].idList.splice(form.value[props.options.id].idList.indexOf(id), 1)
  form.value[props.options.id].optionList.splice(index, 1)
}
/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>