import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

// ダミーデータ
const dummyChildren = [
  {
    id: 1,
    name: '山田太郎',
    birthDate: '2023-06-15',
    gender: 'male',
    createdAt: '2024-02-15T10:00:00.000Z',
    personalityInfo: {
      sleepHabits: {
        bedtime: '20:00',
        wakeTime: '07:00',
        napTime: '13:00-15:00',
        routine: 'お気に入りの音楽を流しながら、絵本を読んであげる',
        nightCrying: '軽くトントンしながら、優しく声をかける'
      },
      playPreferences: {
        favorites: '積み木遊び、ボール遊び',
        toys: 'ぬいぐるみ、積み木',
        tips: '一緒に歌を歌うと喜ぶ'
      }
    },
    schoolInfo: {
      schools: [
        {
          id: 1,
          name: 'さくら保育園',
          type: '保育園',
          class: 'ひよこ組',
          teacher: '山田先生',
          contact: '03-1234-5678',
          startTime: '09:00',
          endTime: '17:00',
          notes: '持ち物：お昼寝セット、着替え'
        }
      ]
    },
    growthRecords: [
      {
        id: 1,
        date: '2024-02-15',
        height: 75.5,
        weight: 9.2,
        note: '順調に成長しています。'
      },
      {
        id: 2,
        date: '2024-01-15',
        height: 74.0,
        weight: 8.8,
        note: '体重の増加が緩やかです。'
      }
    ],
    developmentRecords: {
      milestones: [
        { id: 1, name: '首すわり', achieved: true, date: '2023-09-15', note: '予定通り達成' },
        { id: 2, name: '寝返り', achieved: true, date: '2023-11-20', note: '両方向に寝返りができるようになりました' },
        { id: 3, name: 'お座り', achieved: false, date: '', note: '' }
      ]
    },
    medicalInfo: {
      allergies: [
        {
          id: 1,
          name: '卵',
          onsetDate: '2023-12-01',
          symptoms: '発疹、かゆみ',
          severity: 'moderate',
          treatment: '医師に相談の上、段階的に解除予定'
        }
      ],
      conditions: [],
      doctors: [
        {
          id: 1,
          hospitalName: '山田小児科',
          department: '小児科',
          name: '山田花子',
          phone: '03-1234-5678',
          address: '東京都渋谷区...',
          hours: '9:00-18:00 (土日祝休)'
        }
      ]
    }
  }
]

export const useChildStore = defineStore('child', () => {
  const children = ref(dummyChildren)
  const selectedChildId = ref(1)
  
  // 展開状態の管理
  const expansionState = useLocalStorage('childInfoExpansionState', {
    kindergarten: true,
    allergy: true,
    condition: true,
    doctor: true
  })

  const selectedChild = computed(() => 
    children.value.find(child => child.id === selectedChildId.value)
  )

  // 基本情報の管理
  function addChild(childData) {
    const newChild = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      growthRecords: [],
      developmentRecords: {
        milestones: [],
      },
      medicalInfo: {
        allergies: [],
        conditions: [],
        doctors: []
      },
      ...childData
    }
    children.value.push(newChild)
    return newChild.id
  }

  function updateChild(id, updates) {
    const index = children.value.findIndex(child => child.id === id)
    if (index !== -1) {
      children.value[index] = { ...children.value[index], ...updates }
    }
  }

  // 成長記録の管理
  function addGrowthRecord(childId, record) {
    const child = children.value.find(c => c.id === childId)
    if (!child) return

    if (!child.growthRecords) {
      child.growthRecords = []
    }

    child.growthRecords.push({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...record
    })
  }

  function updateGrowthRecord(childId, recordId, updates) {
    const child = children.value.find(c => c.id === childId)
    if (!child || !child.growthRecords) return

    const index = child.growthRecords.findIndex(r => r.id === recordId)
    if (index !== -1) {
      child.growthRecords[index] = { ...child.growthRecords[index], ...updates }
    }
  }

  // 発達記録の管理
  function addDevelopmentRecord(childId, record) {
    const child = children.value.find(c => c.id === childId)
    if (!child) return

    if (!child.developmentRecords) {
      child.developmentRecords = {
        milestones: []
      }
    }

    if (record.type === 'milestone') {
      const index = child.developmentRecords.milestones.findIndex(m => m.id === record.data.id)
      if (index !== -1) {
        child.developmentRecords.milestones[index] = record.data
      } else {
        child.developmentRecords.milestones.push(record.data)
      }
    }
  }

  function updateDevelopmentRecord(childId, update) {
    const child = children.value.find(c => c.id === childId)
    if (!child) return

    if (!child.developmentRecords) {
      child.developmentRecords = {
        milestones: []
      }
    }

    if (update.type === 'milestone') {
      const index = child.developmentRecords.milestones.findIndex(m => m.id === update.data.id)
      if (index !== -1) {
        child.developmentRecords.milestones[index] = update.data
      } else {
        child.developmentRecords.milestones.push(update.data)
      }
    }
  }

  // 医療情報の管理
  function updateMedicalInfo(childId, info) {
    const child = children.value.find(c => c.id === childId)
    if (!child) return

    if (!child.medicalInfo) {
      child.medicalInfo = {
        allergies: [],
        conditions: [],
        doctors: []
      }
    }

    child.medicalInfo = { ...child.medicalInfo, ...info }
  }

  return {
    children,
    selectedChildId,
    selectedChild,
    expansionState,
    addChild,
    updateChild,
    addGrowthRecord,
    updateGrowthRecord,
    addDevelopmentRecord,
    updateDevelopmentRecord,
    updateMedicalInfo
  }
})