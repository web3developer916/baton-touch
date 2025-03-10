import React, { useState } from 'react'
import { X as XIcon } from 'lucide-react'

const MedicationForm = ({ initialData, onSave, onCancel }) => {
  const [medicationForm, setMedicationForm] = useState({
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    dosage: initialData?.dosage || '',
    timing: initialData?.timing || '',
    notes: initialData?.notes || ''
  })

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="text-xl font-bold">{initialData ? '服薬記録を編集' : '服薬記録を追加'}</h3>
          <button onClick={onCancel}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          onSave(medicationForm)
        }} className="modal-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              薬の名前
            </label>
            <input type="text"
                   value={medicationForm.name}
                   onChange={e => setMedicationForm(prev => ({ ...prev, name: e.target.value }))}
                   className="input w-full"
                   required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                服用開始日
              </label>
              <input type="date"
                     value={medicationForm.startDate}
                     onChange={e => setMedicationForm(prev => ({ ...prev, startDate: e.target.value }))}
                     className="input w-full"
                     required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              服用タイミング
            </label>
            <input type="text"
                   value={medicationForm.timing}
                   onChange={e => setMedicationForm(prev => ({ ...prev, timing: e.target.value }))}
                   className="input w-full"
                   placeholder="例: 朝・昼・夕食後"
                   required />
          </div>
        </form>

        <div className="modal-footer">
          <div className="flex justify-end space-x-3">
            <button type="button"
                    onClick={onCancel}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
              キャンセル
            </button>
            <button onClick={() => onSave(medicationForm)}
                    className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicationForm