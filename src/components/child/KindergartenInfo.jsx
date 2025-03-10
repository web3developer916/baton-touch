import React, { useState } from 'react'
import { Plus as PlusIcon, ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon, 
         Pencil as PencilIcon, Trash2 as Trash2Icon, X as XIcon, Phone as PhoneIcon } from 'lucide-react'
import { useChildStore } from '../../stores/useChildStore'

const KindergartenInfo = ({ schoolInfo, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showNewSchoolForm, setShowNewSchoolForm] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [editingSchool, setEditingSchool] = useState(null)
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    type: '',
    class: '',
    teacher: '',
    contact: '',
    startTime: '',
    endTime: '',
    notes: ''
  })

  const schools = schoolInfo.schools || []

  const showSchoolDetails = (school) => {
    setSelectedSchool(school)
  }

  const editSchool = (school) => {
    setEditingSchool(school)
    setSchoolForm({ ...school })
    setShowNewSchoolForm(true)
    setSelectedSchool(null)
  }

  const deleteSchool = (id) => {
    if (confirm('この園情報を削除してもよろしいですか？')) {
      onUpdate({
        schools: schools.filter(s => s.id !== id)
      })
      setSelectedSchool(null)
    }
  }

  const saveSchool = () => {
    const updatedSchools = [...schools]
    const isNewRegistration = !editingSchool

    if (editingSchool) {
      const index = updatedSchools.findIndex(s => s.id === editingSchool.id)
      if (index !== -1) {
        updatedSchools[index] = {
          ...editingSchool,
          ...schoolForm
        }
      }
    } else {
      updatedSchools.push({
        id: Date.now(),
        ...schoolForm
      })
    }

    onUpdate({ schools: updatedSchools })
    
    // 新規登録の場合は展開状態をtrueに設定
    if (isNewRegistration) {
      setIsExpanded(true)
    }
    
    cancelEdit()
  }

  const cancelEdit = () => {
    setShowNewSchoolForm(false)
    setEditingSchool(null)
    setSchoolForm({
      name: '',
      type: '',
      class: '',
      teacher: '',
      contact: '',
      startTime: '',
      endTime: '',
      notes: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="card relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">幼稚園・保育園</h3>
          <div className="flex space-x-2">
            <button onClick={() => setShowNewSchoolForm(true)} 
                    className="p-2 text-primary-600 hover:text-primary-700">
              <PlusIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:text-primary-600 transition-colors">
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {schools.map(school => (
              <div key={school.id}
                   className="p-4 bg-background rounded-xl cursor-pointer hover:bg-gray-50"
                   onClick={() => showSchoolDetails(school)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{school.name}</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{school.type}</p>
                      <a href={`tel:${school.contact}`}
                         className="text-sm text-primary-600 hover:text-primary-700"
                         onClick={e => e.stopPropagation()}>
                        {school.contact}
                      </a>
                    </div>
                  </div>
                  <button onClick={(e) => {
                    e.stopPropagation()
                    deleteSchool(school.id)
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {selectedSchool && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selectedSchool.name}</h3>
                <p className="text-sm text-gray-600">{selectedSchool.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => editSchool(selectedSchool)}
                        className="p-2 text-gray-400 hover:text-primary-500">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedSchool(null)}
                        className="p-2 text-gray-900 hover:text-primary-600">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">クラス</p>
                  <p className="font-medium">{selectedSchool.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">担任の先生</p>
                  <p className="font-medium">{selectedSchool.teacher}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">連絡先</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="font-medium">{selectedSchool.contact}</p>
                  <a href={`tel:${selectedSchool.contact}`}
                     className="btn bg-primary-50 text-primary-600">
                    <PhoneIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">登園時間</p>
                <p className="font-medium">{selectedSchool.startTime} 〜 {selectedSchool.endTime}</p>
              </div>

              {selectedSchool.notes && (
                <div>
                  <p className="text-sm text-gray-600">備考</p>
                  <p className="font-medium whitespace-pre-wrap">{selectedSchool.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 新規登録フォーム (モーダル) */}
      {showNewSchoolForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingSchool ? '園情報を編集' : '新しい園情報を登録'}
              </h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              saveSchool()
            }} className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  園名
                </label>
                <input type="text"
                       value={schoolForm.name}
                       onChange={e => setSchoolForm(prev => ({ ...prev, name: e.target.value }))}
                       className="input w-full"
                       required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  種別
                </label>
                <select value={schoolForm.type}
                        onChange={e => setSchoolForm(prev => ({ ...prev, type: e.target.value }))}
                        className="input w-full"
                        required>
                  <option value="">選択してください</option>
                  <option value="保育園">保育園</option>
                  <option value="幼稚園">幼稚園</option>
                  <option value="認定こども園">認定こども園</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  クラス
                </label>
                <input type="text"
                       value={schoolForm.class}
                       onChange={e => setSchoolForm(prev => ({ ...prev, class: e.target.value }))}
                       className="input w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  担任の先生
                </label>
                <input type="text"
                       value={schoolForm.teacher}
                       onChange={e => setSchoolForm(prev => ({ ...prev, teacher: e.target.value }))}
                       className="input w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  連絡先
                </label>
                <input type="tel"
                       value={schoolForm.contact}
                       onChange={e => setSchoolForm(prev => ({ ...prev, contact: e.target.value }))}
                       className="input w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    登園時間
                  </label>
                  <input type="time"
                         value={schoolForm.startTime}
                         onChange={e => setSchoolForm(prev => ({ ...prev, startTime: e.target.value }))}
                         className="input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    降園時間
                  </label>
                  <input type="time"
                         value={schoolForm.endTime}
                         onChange={e => setSchoolForm(prev => ({ ...prev, endTime: e.target.value }))}
                         className="input w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  備考
                </label>
                <textarea value={schoolForm.notes}
                         onChange={e => setSchoolForm(prev => ({ ...prev, notes: e.target.value }))}
                         className="input w-full h-24 resize-none"
                         placeholder="持ち物や注意事項など"></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button"
                        onClick={cancelEdit}
                        className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                  キャンセル
                </button>
                <button onClick={saveSchool}
                        className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default KindergartenInfo