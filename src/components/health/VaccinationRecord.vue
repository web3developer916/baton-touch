<template>
  <div class="space-y-6">
    <!-- 新規記録ボタン -->
    <button @click="showNewVaccinationForm = true"
            class="w-full btn bg-white text-primary-600 border-2 border-primary-200 
                   hover:bg-primary-50 hover:border-primary-300 hover:scale-[1.02]
                   transition-all duration-300 group flex items-center justify-center">
      <PlusIcon class="w-5 h-5 mr-2" />
      新しい予防接種を記録
    </button>

    <!-- 接種履歴 -->
    <div class="space-y-4 mt-6">
      <div v-for="(group, year) in groupedRecords" :key="year" class="card">
        <h4 class="text-base font-bold text-gray-500 mb-4">{{ year }}年</h4>
        
        <div class="space-y-3">
          <div v-for="record in group" :key="record.id"
               @click="showDetails(record)"
               class="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                      transition-all cursor-pointer">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-gray-900">{{ record.vaccines.join('・') }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(record.date) }}</p>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 詳細モーダル -->
    <div v-if="selectedRecord"
         class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold">{{ selectedRecord.vaccines.join('・') }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(selectedRecord.date) }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="editRecord(selectedRecord)"
                    class="p-2 text-gray-400 hover:text-primary-500">
              <PencilIcon class="w-4 h-4" />
            </button>
            <button @click="deleteRecord(selectedRecord.id)"
                    class="p-2 text-gray-400 hover:text-red-500">
              <TrashIcon class="w-4 h-4" />
            </button>
            <button @click="selectedRecord = null"
                    class="p-2 text-gray-400 hover:text-gray-500">
              <XIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div class="modal-body space-y-4">
          <div>
            <p class="text-sm text-gray-500">接種場所</p>
            <p class="font-medium">{{ selectedRecord.location }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">接種医</p>
            <p class="font-medium">{{ selectedRecord.doctor }}</p>
          </div>
          <div v-if="selectedRecord.notes">
            <p class="text-sm text-gray-500">メモ</p>
            <p class="whitespace-pre-wrap">{{ selectedRecord.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 新規記録フォーム (モーダル) -->
    <div v-if="showNewVaccinationForm"
         class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-bold">
            {{ editingRecord ? '記録を編集' : '新しい予防接種記録' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveRecord" class="modal-body space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ワクチン名
            </label>
            <div class="space-y-2">
              <div v-for="(vaccine, index) in recordForm.vaccines" :key="index"
                   class="flex items-center space-x-2">
                <input type="text" v-model="recordForm.vaccines[index]"
                       class="input flex-1"
                       placeholder="ワクチン名を入力"
                       required />
                <button type="button" @click="removeVaccine(index)"
                        class="p-2 text-red-500 hover:text-red-600">
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
              <button type="button" @click="addVaccine"
                      class="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl
                             text-gray-500 hover:border-primary-300 hover:text-primary-600
                             transition-colors">
                <PlusIcon class="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                接種日
              </label>
              <input type="date" v-model="recordForm.date"
                     class="input w-full" required />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                接種医
              </label>
              <input type="text" v-model="recordForm.doctor"
                     class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                接種場所
              </label>
              <input type="text" v-model="recordForm.location"
                     class="input w-full" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              メモ
            </label>
            <textarea v-model="recordForm.notes"
                      class="input w-full h-24 resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              次回接種のリマインダー
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" v-model="recordForm.reminder.beforeDay"
                       class="input mr-2" />
                <span>前日に通知</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="recordForm.reminder.onDay"
                       class="input mr-2" />
                <span>当日に通知</span>
              </label>
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
import { format, parseISO, addMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  PlusIcon, PencilIcon, TrashIcon, XIcon, ChevronRightIcon
} from 'lucide-vue-next'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  },
  birthDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['add', 'update', 'delete'])

const showNewVaccinationForm = ref(false)
const editingRecord = ref(null)
const selectedRecord = ref(null)

const recordForm = ref({
  vaccines: [''],
  date: '',
  doctor: '',
  location: '',
  notes: '',
  reminder: {
    beforeDay: false,
    onDay: false
  }
})

function showDetails(record) {
  selectedRecord.value = record
}

function addVaccine() {
  recordForm.value.vaccines.push('')
}

function removeVaccine(index) {
  recordForm.value.vaccines.splice(index, 1)
  if (recordForm.value.vaccines.length === 0) {
    recordForm.value.vaccines.push('')
  }
}

const groupedRecords = computed(() => {
  return props.records.reduce((groups, record) => {
    const year = format(parseISO(record.date), 'yyyy')
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(record)
    return groups
  }, {})
})

function formatDate(dateString) {
  return format(parseISO(dateString), 'M月d日(E)', { locale: ja })
}

function editRecord(record) {
  editingRecord.value = record
  recordForm.value = { ...record }
  showNewVaccinationForm.value = true
  selectedRecord.value = null
}

function deleteRecord(id) {
  if (confirm('この記録を削除してもよろしいですか？')) {
    emit('delete', id)
    selectedRecord.value = null
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
  showNewVaccinationForm.value = false
  editingRecord.value = null
  recordForm.value = {
    vaccines: [''],
    date: '',
    doctor: '',
    location: '',
    notes: '',
    reminder: {
      beforeDay: false,
      onDay: false
    }
  }
}
</script>