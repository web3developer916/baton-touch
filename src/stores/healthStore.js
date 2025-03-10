import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHealthStore = defineStore('health', () => {
  const healthRecords = ref([])
  const normalTemperature = ref({})
  const medications = ref([])
  const hospitalVisits = ref([])
  const symptomRecords = ref([])
  const illnesses = ref([])
  const vaccinationRecords = ref([])
  const vaccinationSchedules = ref([])

  // 体温記録の追加
  function addTemperatureRecord(childId, record) {
    healthRecords.value.push({
      id: Date.now(),
      childId,
      type: 'temperature',
      createdAt: new Date().toISOString(),
      ...record
    })
  }

  // 症状記録の追加
  function addSymptomRecord(childId, record) {
    healthRecords.value.push({
      id: Date.now(),
      childId,
      type: 'symptom',
      createdAt: new Date().toISOString(),
      ...record
    })
  }

  // 記録の更新
  function updateRecord(recordId, updates) {
    const index = healthRecords.value.findIndex(r => r.id === recordId)
    if (index !== -1) {
      healthRecords.value[index] = {
        ...healthRecords.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  // 記録の削除
  function deleteRecord(recordId) {
    healthRecords.value = healthRecords.value.filter(r => r.id !== recordId)
  }

  // 平熱の設定
  function setNormalTemperature(childId, temperature) {
    normalTemperature.value[childId] = temperature
  }

  // 子供ごとの記録を取得
  const getChildRecords = computed(() => (childId) => {
    return healthRecords.value.filter(r => r.childId === childId)
  })

  // 子供の平熱を取得
  const getChildNormalTemperature = computed(() => (childId) => {
    return normalTemperature.value[childId] || 36.5
  })

  // 服薬記録の追加
  function addMedication(childId, medication) {
    medications.value.push({
      id: Date.now(),
      childId,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...medication
    })
  }

  // 服薬記録の更新
  function updateMedication(medicationId, updates) {
    const index = medications.value.findIndex(m => m.id === medicationId)
    if (index !== -1) {
      medications.value[index] = {
        ...medications.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  // 服薬記録の削除
  function deleteMedication(medicationId) {
    medications.value = medications.value.filter(m => m.id !== medicationId)
  }

  // 病院受診記録の追加
  function addHospitalVisit(childId, visit) {
    hospitalVisits.value.push({
      id: Date.now(),
      childId,
      createdAt: new Date().toISOString(),
      ...visit
    })
  }

  // 病院受診記録の更新
  function updateHospitalVisit(visitId, updates) {
    const index = hospitalVisits.value.findIndex(v => v.id === visitId)
    if (index !== -1) {
      hospitalVisits.value[index] = {
        ...hospitalVisits.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  // 病院受診記録の削除
  function deleteHospitalVisit(visitId) {
    hospitalVisits.value = hospitalVisits.value.filter(v => v.id !== visitId)
  }

  // 子供ごとの服薬記録を取得
  const getChildMedications = computed(() => (childId) => {
    return medications.value.filter(m => m.childId === childId)
  })

  // 子供ごとの病院受診記録を取得
  const getChildHospitalVisits = computed(() => (childId) => {
    return hospitalVisits.value.filter(v => v.childId === childId)
  })

  // 病気記録の管理
  function addIllness(childId, illness) {
    illnesses.value.push({
      id: Date.now(),
      childId,
      createdAt: new Date().toISOString(),
      symptoms: illness.symptoms.map(symptom => ({
        ...symptom,
        onsetDate: illness.startDate,
        recoveryDate: null,
        recovered: false
      })),
      hospitalVisits: [],
      medications: [],
      ...illness
    })
  }

  function updateIllness(illnessId, updates) {
    const index = illnesses.value.findIndex(i => i.id === illnessId)
    if (index !== -1) {
      illnesses.value[index] = {
        ...illnesses.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function deleteIllness(illnessId) {
    illnesses.value = illnesses.value.filter(i => i.id !== illnessId)
  }

  // 症状の削除
  function deleteSymptom(illnessId, symptomId) {
    const illnessIndex = illnesses.value.findIndex(i => i.id === illnessId)
    if (illnessIndex !== -1) {
      illnesses.value[illnessIndex].symptoms = 
        illnesses.value[illnessIndex].symptoms.filter(s => s.id !== symptomId)
    }
  }

  // 子供ごとの病気記録を取得
  const getChildIllnesses = computed(() => (childId) => {
    return illnesses.value
      .filter(i => i.childId === childId)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  })

  // 症状記録の追加
  function addSymptomRecord(childId, record) {
    symptomRecords.value.push({
      id: Date.now(),
      childId,
      createdAt: new Date().toISOString(),
      ...record
    })
  }

  // 症状記録の更新
  function updateSymptomRecord(recordId, updates) {
    const index = symptomRecords.value.findIndex(r => r.id === recordId)
    if (index !== -1) {
      symptomRecords.value[index] = {
        ...symptomRecords.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  // 症状記録の削除
  function deleteSymptomRecord(recordId) {
    symptomRecords.value = symptomRecords.value.filter(r => r.id !== recordId)
  }

  // 予防接種記録の追加
  function addVaccinationRecord(childId, record) {
    vaccinationRecords.value.push({
      id: Date.now(),
      childId,
      createdAt: new Date().toISOString(),
      ...record
    })
  }

  // 予防接種記録の更新
  function updateVaccinationRecord(recordId, updates) {
    const index = vaccinationRecords.value.findIndex(r => r.id === recordId)
    if (index !== -1) {
      vaccinationRecords.value[index] = {
        ...vaccinationRecords.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  // 予防接種記録の削除
  function deleteVaccinationRecord(recordId) {
    vaccinationRecords.value = vaccinationRecords.value.filter(r => r.id !== recordId)
  }

  // 子供ごとの症状記録を取得
  const getChildSymptomRecords = computed(() => (childId) => {
    return symptomRecords.value
      .filter(r => r.childId === childId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  // 子供ごとの予防接種記録を取得
  const getChildVaccinationRecords = computed(() => (childId) => {
    return vaccinationRecords.value
      .filter(r => r.childId === childId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  return {
    healthRecords,
    normalTemperature,
    medications,
    hospitalVisits,
    addTemperatureRecord,
    addSymptomRecord,
    updateRecord,
    deleteRecord,
    setNormalTemperature,
    getChildRecords,
    getChildNormalTemperature,
    addMedication,
    updateMedication,
    deleteMedication,
    addHospitalVisit,
    updateHospitalVisit,
    deleteHospitalVisit,
    getChildMedications,
    getChildHospitalVisits,
    addSymptomRecord,
    updateSymptomRecord,
    addIllness,
    updateIllness,
    deleteIllness,
    deleteSymptom,
    getChildIllnesses,
    deleteSymptomRecord,
    addVaccinationRecord,
    updateVaccinationRecord,
    deleteVaccinationRecord,
    getChildSymptomRecords,
    getChildVaccinationRecords
  }
})