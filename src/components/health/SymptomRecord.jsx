import React, { useState, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  Plus as PlusIcon, Pencil as PencilIcon, Trash as TrashIcon,
  Camera as CameraIcon, X as XIcon
} from 'lucide-react'

const SymptomRecord = ({ records, onAdd, onUpdate, onDelete }) => {
  const [showNewSymptomForm, setShowNewSymptomForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [expandedRecordId, setExpandedRecordId] = useState(null)
  const fileInput = useRef(null)

  const [recordForm, setRecordForm] = useState({
    symptom: '',
    details: '',
    startDate: '',
    duration: '',
    photoUrl: null
  })

  const symptoms = [
    '発熱', '咳', '鼻水', '鼻づまり', '嘔吐', 
    '下痢', '発疹', '食欲不振', '機嫌が悪い', 'その他'
  ]

  const groupedRecords = records.reduce((groups, record) => {
    const date = record.startDate
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(record)
    return groups
  }, {})

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'M月d日(E)', { locale: ja })
  }

  const formatTime = (dateString) => {
    return format(parseISO(dateString), 'HH:mm')
  }

  const getSymptomTagClass = (symptom) => {
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

  const triggerPhotoUpload = () => {
    fileInput.current.click()
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setRecordForm(prev => ({
          ...prev,
          photoUrl: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setRecordForm(prev => ({
      ...prev,
      photoUrl: null
    }))
  }

  const editRecord = (record) => {
    setEditingRecord(record)
    setRecordForm({ ...record })
    setShowNewSymptomForm(true)
  }

  const deleteRecord = (id) => {
    if (confirm('この記録を削除してもよろしいですか？')) {
      onDelete(id)
    }
  }

  const saveRecord = () => {
    if (editingRecord) {
      onUpdate({
        ...editingRecord,
        ...recordForm
      })
    } else {
      onAdd({
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...recordForm
      })
    }
    cancelEdit()
  }

  const cancelEdit = () => {
    setShowNewSymptomForm(false)
    setEditingRecord(null)
    setRecordForm({
      symptom: '',
      details: '',
      startDate: '',
      duration: '',
      photoUrl: null
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">体調記録</h3>
        <button onClick={() => setShowNewSymptomForm(true)} 
                className="btn btn-primary">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 記録一覧 */}
      <div className="space-y-4">
        {Object.entries(groupedRecords).map(([date, group]) => (
          <div key={date} className="card">
            <h4 className="font-medium text-gray-900 mb-3">{formatDate(date)}</h4>
            
            <div className="space-y-3">
              {group.map(record => (
                <div key={record.id}
                     className="p-4 bg-background rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span className={`${getSymptomTagClass(record.symptom)} px-3 py-1 rounded-full text-sm`}>
                        {record.symptom}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTime(record.createdAt)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => editRecord(record)}
                              className="p-2 text-gray-400 hover:text-primary-500">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteRecord(record.id)}
                              className="p-2 text-gray-400 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-gray-600">{record.details}</p>

                  {record.photoUrl && (
                    <div className="mt-3">
                      <img src={record.photoUrl} 
                           alt={record.symptom}
                           className="rounded-lg max-h-48 object-cover" />
                    </div>
                  )}

                  <div className="mt-2 text-sm text-gray-500">
                    発症: {formatDate(record.startDate)}
                    {record.duration && (
                      <span>({record.duration}日間)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 新規記録フォーム (モーダル) */}
      {showNewSymptomForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingRecord ? '記録を編集' : '新しい体調記録'}
              </h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              saveRecord()
            }} className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  症状
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {symptoms.map(symptom => (
                    <button key={symptom}
                            type="button"
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                              recordForm.symptom === symptom
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setRecordForm(prev => ({ ...prev, symptom }))}>
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  症状の詳細
                </label>
                <textarea value={recordForm.details}
                         onChange={e => setRecordForm(prev => ({ ...prev, details: e.target.value }))}
                         className="input w-full h-24 resize-none"
                         placeholder="症状の程度、頻度、色、状態などを詳しく記録してください"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    発症日
                  </label>
                  <input type="date"
                         value={recordForm.startDate}
                         onChange={e => setRecordForm(prev => ({ ...prev, startDate: e.target.value }))}
                         className="input w-full"
                         required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    継続日数
                  </label>
                  <input type="number"
                         value={recordForm.duration}
                         onChange={e => setRecordForm(prev => ({ ...prev, duration: e.target.value }))}
                         className="input w-full"
                         min="1"
                         placeholder="日数" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  写真
                </label>
                <div className="mt-1 flex items-center">
                  {recordForm.photoUrl ? (
                    <div className="relative">
                      <img src={recordForm.photoUrl}
                           className="h-24 w-24 object-cover rounded-lg" />
                      <button type="button"
                              onClick={removePhoto}
                              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg text-red-500 hover:text-red-600">
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button"
                            onClick={triggerPhotoUpload}
                            className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-500">
                      <CameraIcon className="w-6 h-6" />
                    </button>
                  )}
                  <input type="file"
                         ref={fileInput}
                         className="hidden"
                         accept="image/*"
                         onChange={handlePhotoUpload} />
                </div>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button type="button"
                        onClick={cancelEdit}
                        className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                  キャンセル
                </button>
                <button onClick={saveRecord}
                        className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SymptomRecord