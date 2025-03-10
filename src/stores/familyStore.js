import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ダミーデータ
const dummyFamilies = [
  {
    id: 1,
    name: '山田家',
    isAdmin: true,
    members: [
      { id: 1, name: 'パパ', role: 'father', isAdmin: true },
      { id: 2, name: 'ママ', role: 'mother' },
      { id: 3, name: '祖父', role: 'grandfather' }
    ],
    children: [1], // 子供のID参照
    createdAt: '2024-02-15T10:00:00.000Z'
  },
  {
    id: 2,
    name: '佐藤家',
    isAdmin: false,
    members: [
      { id: 4, name: 'パパ', role: 'father' },
      { id: 5, name: 'ママ', role: 'mother' }
    ],
    children: [2],
    createdAt: '2024-02-15T10:00:00.000Z'
  }
]

export const useFamilyStore = defineStore('family', () => {
  const families = ref(dummyFamilies)
  const selectedFamilyId = ref(1)

  // 家族グループの削除
  function deleteFamily(id) {
    families.value = families.value.filter(f => f.id !== id)
    // 削除後、他のグループがある場合は最初のグループを選択
    if (selectedFamilyId.value === id && families.value.length > 0) {
      selectedFamilyId.value = families.value[0].id
    }
  }

  const selectedFamily = computed(() => 
    families.value.find(family => family.id === selectedFamilyId.value)
  )

  function addFamily(familyData) {
    const newFamily = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      members: [],
      children: [],
      ...familyData
    }
    families.value.push(newFamily)
    return newFamily.id
  }

  function updateFamily(id, updates) {
    const index = families.value.findIndex(family => family.id === id)
    if (index !== -1) {
      families.value[index] = { ...families.value[index], ...updates }
    }
  }

  function addMember(familyId, memberData) {
    const family = families.value.find(f => f.id === familyId)
    if (!family) return

    const newMember = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...memberData
    }
    family.members.push(newMember)
    return newMember.id
  }

  function removeMember(familyId, memberId) {
    const family = families.value.find(f => f.id === familyId)
    if (!family) return

    family.members = family.members.filter(m => m.id !== memberId)
  }

  return {
    families,
    selectedFamilyId,
    selectedFamily,
    addFamily,
    updateFamily,
    deleteFamily,
    addMember,
    removeMember
  }
})