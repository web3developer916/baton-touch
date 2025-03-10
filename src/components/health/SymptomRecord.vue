<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">体調記録</h3>
      <button @click="showNewSymptomForm = true" 
              class="btn btn-primary">
        <PlusIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- 記録一覧 -->
    <div class="space-y-4">
      <div v-for="(group, date) in groupedRecords" :key="date" class="card">
        <h4 class="font-medium text-gray-900 mb-3">{{ formatDate(date) }}</h4>
        
        <div class="space-y-3">
          <div v-for="record in group" :key="record.id"
               class="p-4 bg-background rounded-xl">
            <div class="flex justify-between items-start">
              <div class="flex items-center space-x-2">
                <span :class="getSymptomTagClass(record.symptom)"
                      class="px-3 py-1 rounded-full text-sm">
                  {{ record.symptom }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ formatTime(record.createdAt) }}
                </span>
              </div>
              <div class="flex space-x-2">
                <button @click="editRecord(record)"
                        class="p-2 text-gray-400 hover:text-primary-500">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button @click="deleteRecord(record.id)"
                        class="p-2 text-gray-400 hover:text-red-500">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="mt-2 text-gray-600">{{ record.details }}</p>

            <!-- 写真がある場合 -->
            <div v-if="record.photoUrl" class="mt-3">
              <img :src="record.photoUrl" 
                   :alt="record.symptom"
                   class="rounded-lg max-h-48 object-cover" />
            </div>

            <div class="mt-2 text-sm text-gray-500">
              発症: {{ formatDate(record.startDate) }}
              <span v-if="record.duration">
                ({{ record.duration }}日間)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新規記録フォーム (モーダル) -->
    <div v-if="showNewSymptomForm"
         class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-bold">
            {{ editingRecord ? '記録を編集' : '新しい体調記録' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveRecord" class="modal-body space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              症状
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="symptom in symptoms" :key="symptom"
                      type="button"
                      :class="[
                        'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        recordForm.symptom === symptom
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      ]"
                      @click="recordForm.symptom = symptom">
                {{ symptom }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              症状の詳細
            </label>
            <textarea v-model="recordForm.details"
                      class="input w-full h-24 resize-none"
                      placeholder="症状の程度、頻度、色、状態などを詳しく記録してください"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                発症日
              </label>
              <input type="date" v-model="recordForm.startDate"
                     class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                継続日数
              </label>
              <input type="number" v-model="recordForm.duration"
                     class="input w-full"
                     min="1" placeholder="日数" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              写真
            </label>
            <div class="mt-1 flex items-center">
              <div v-if="recordForm.photoUrl" class="relative">
                <img :src="recordForm.photoUrl"
                     class="h-24 w-24 object-cover rounded-lg" />
                <button type="button"
                        @click="removePhoto"
                        class="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg
                               text-red-500 hover:text-red-600">
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
              <button v-else
                      type="button"
                      @click="triggerPhotoUpload"
                      class="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg
                             flex items-center justify-center text-gray-400
                             hover:border-primary-300 hover:text-primary-500">
                <CameraIcon class="w-6 h-6" />
              </button>
              <input type="file"
                     ref="photoInput"
                     class="hidden"
                     accept="image/*"
                     @change="handlePhotoUpload" />
            </div>
          </div>
        </form>

        <div class="modal-footer">
          <div class="flex justify-end space-x-3">
            <button type="button"
                    @click="cancelEdit"
                    class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
              キャンセル
            </button>
            <button type="submit"
                    @click="saveRecord"
                    class="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  PlusIcon, PencilIcon, TrashIcon,
  CameraIcon, XIcon
} from 'lucide-vue-next'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add', 'update', 'delete'])

const symptoms = [
  '発熱', '咳', '鼻水', '鼻づまり', '嘔吐', 
  '下痢', '発疹', '食欲不振', '機嫌が悪い', 'その他'
]

const showNewSymptomForm = ref(false)
const editingRecord = ref(null)
const photoInput = ref(null)

const recordForm = ref({
  symptom: '',
  details: '',
  startDate: '',
  duration: '',
  photoUrl: null
})

const groupedRecords = computed(() => {
  return props.records.reduce((groups, record) => {
    const date = record.startDate
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(record)
    return groups
  }, {})
})

function formatDate(dateString) {
  return format(parseISO(dateString), 'M月d日(E)', { locale: ja })
}

function formatTime(dateString) {
  return format(parseISO(dateString), 'HH:mm')
}

function getSymptomTagClass(symptom) {
  switch (symptom) {
    case '発熱':
      return 'bg-red-100 text-red-700'
    case '咳':
    case '鼻水':
    case '鼻づまり':
      return 'bg-blue-100 text-blue-700'
    case '嘔吐':
    case '下痢':
      return 'bg-yellow-100 text-yellow-700'
    case '発疹':
      return 'bg-pink-100 text-pink-700'
    case '食欲不振':
    case '機嫌が悪い':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function triggerPhotoUpload() {
  photoInput.value.click()
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      recordForm.value.photoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removePhoto() {
  recordForm.value.photoUrl = null
}

function editRecord(record) {
  editingRecord.value = record
  recordForm.value = { ...record }
  showNewSymptomForm.value = true
}

function deleteRecord(id) {
  if (confirm('この記録を削除してもよろしいですか？')) {
    emit('delete', id)
  }
}

function saveRecord() {
  if (editingRecord.value) {
    emit('update', {
      ...editingRecord.value,
      ...recordForm.value
    })
  } else {
    emit('add', {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...recordForm.value
    })
  }
  cancelEdit()
}

function cancelEdit() {
  showNewSymptomForm.value = false
  editingRecord.value = null
  recordForm.value = {
    symptom: '',
    details: '',
    startDate: '',
    duration: '',
    photoUrl: null
  }
}
</script>