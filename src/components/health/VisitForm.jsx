import React, { useState } from 'react'
import { X as XIcon } from 'lucide-react'

const VisitForm = ({ initialData, onSave, onCancel }) => {
  const [visitForm, setVisitForm] = useState({
    hospitalName: initialData?.hospitalName || '',
    doctor: initialData?.doctor || '',
    visitDate: initialData?.visitDate || '',
    diagnosis: initialData?.diagnosis || '',
    prescription: initialData?.prescription || '',
    nextVisit: initialData?.nextVisit || ''
  })

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="text-xl font-bold">{initialData ? '受診記録を編集' : '受診記録を追加'}</h3>
          <button onClick={onCancel}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          onSave(visitForm)
        }} className="modal-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              受診日
            </label>
            <input type="date"
                   value={visitForm.visitDate}
                   onChange={e => setVisitForm(prev => ({ ...prev, visitDate: e.target.value }))}
                   className="input w-full"
                   required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              病院名
            </label>
            <input type="text"
                   value={visitForm.hospitalName}
                   onChange={e => setVisitForm(prev => ({ ...prev, hospitalName: e.target.value }))}
                   className="input w-full"
                   required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              担当医
            </label>
            <input type="text"
                   value={visitForm.doctor}
                   onChange={e => setVisitForm(prev => ({ ...prev, doctor: e.target.value }))}
                   className="input w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              診断内容
            </label>
            <textarea value={visitForm.diagnosis}
                     onChange={e => setVisitForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                     className="input w-full h-24 resize-none"
                     placeholder="診断された症状や所見を記録"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              処方内容
            </label>
            <textarea value={visitForm.prescription}
                     onChange={e => setVisitForm(prev => ({ ...prev, prescription: e.target.value }))}
                     className="input w-full h-24 resize-none"
                     placeholder="処方された薬の内容を記録"></textarea>
          </div>
        </form>

        <div className="modal-footer">
          <div className="flex justify-end space-x-3">
            <button type="button"
                    onClick={onCancel}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
              キャンセル
            </button>
            <button onClick={() => onSave(visitForm)}
                    className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisitForm