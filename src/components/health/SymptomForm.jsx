import React, { useState } from 'react'
import { X as XIcon } from 'lucide-react'

const SymptomForm = ({ onSave, onCancel, availableSymptoms }) => {
  const [symptomForm, setSymptomForm] = useState({
    type: '',
    onsetDate: '',
    description: ''
  })

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="text-xl font-bold">症状を追加</h3>
          <button onClick={onCancel}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          onSave(symptomForm)
        }} className="modal-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              症状
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableSymptoms.map(symptom => (
                <button key={symptom}
                        type="button"
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          symptomForm.type === symptom
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setSymptomForm(prev => ({ ...prev, type: symptom }))}>
                  {symptom}
                </button>
              ))}
            </div>
            {symptomForm.type === 'その他' && (
              <input type="text"
                     value={symptomForm.otherSymptom || ''}
                     onChange={e => setSymptomForm(prev => ({ ...prev, otherSymptom: e.target.value }))}
                     className="input w-full mt-2"
                     placeholder="症状を入力"
                     required />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              発症日
            </label>
            <input type="date"
                   value={symptomForm.onsetDate}
                   onChange={e => setSymptomForm(prev => ({ ...prev, onsetDate: e.target.value }))}
                   className="input w-full"
                   required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              症状の詳細
            </label>
            <textarea value={symptomForm.description}
                     onChange={e => setSymptomForm(prev => ({ ...prev, description: e.target.value }))}
                     className="input w-full h-24 resize-none"
                     placeholder="症状の程度や特徴を記録"></textarea>
          </div>
        </form>

        <div className="modal-footer">
          <div className="flex justify-end space-x-3">
            <button type="button"
                    onClick={onCancel}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
              キャンセル
            </button>
            <button onClick={() => onSave(symptomForm)}
                    className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SymptomForm