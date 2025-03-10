import React, { useState } from 'react'
import { Plus as PlusIcon, Pencil as PencilIcon, Trash as TrashIcon } from 'lucide-react'
import GrowthChart from './GrowthChart'

const GrowthRecord = ({ records, onAdd, onUpdate, onDelete }) => {
  const [showNewRecordForm, setShowNewRecordForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [showAllRecords, setShowAllRecords] = useState(false)
  const [recordForm, setRecordForm] = useState({
    date: '',
    height: '',
    weight: '',
    note: ''
  })

  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  const latestHeight = sortedRecords[0]?.height
  const latestWeight = sortedRecords[0]?.weight

  const displayedRecords = showAllRecords ? sortedRecords : sortedRecords.slice(0, 3)

  const editRecord = (record) => {
    setEditingRecord(record)
    setRecordForm({ ...record })
    setShowNewRecordForm(true)
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
        ...recordForm
      })
    }
    cancelEdit()
  }

  const cancelEdit = () => {
    setShowNewRecordForm(false)
    setEditingRecord(null)
    setRecordForm({
      date: '',
      height: '',
      weight: '',
      note: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">成長記録</h3>
        <button onClick={() => setShowNewRecordForm(true)} 
                className="btn btn-primary">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 成長グラフ */}
      <div className="bg-white rounded-2xl p-4 shadow-warm">
        <div className="flex space-x-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">現在の身長</p>
            <p className="text-2xl font-bold text-primary-600">
              {latestHeight || '-- '}<span className="text-lg">cm</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">現在の体重</p>
            <p className="text-2xl font-bold text-primary-600">
              {latestWeight || '-- '}<span className="text-lg">kg</span>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <GrowthChart records={records} />
        </div>
      </div>

      {/* 記録一覧 */}
      <div className="space-y-4">
        {/* 最新3件の記録 */}
        <div className="space-y-3">
          {displayedRecords.map(record => (
            <div key={record.id}
                 className="bg-white rounded-xl p-4 shadow-warm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{record.date}</p>
                  <div className="flex space-x-4 mt-1">
                    <p>
                      <span className="font-medium">身長:</span>
                      {record.height}cm
                    </p>
                    <p>
                      <span className="font-medium">体重:</span>
                      {record.weight}kg
                    </p>
                  </div>
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
              {record.note && (
                <p className="text-sm text-gray-600 mt-2">{record.note}</p>
              )}
            </div>
          ))}
        </div>
        
        {/* もっと表示ボタン */}
        {sortedRecords.length > 3 && (
          <button onClick={() => setShowAllRecords(!showAllRecords)}
                  className="w-full py-2 text-primary-600 hover:text-primary-700 font-medium">
            {showAllRecords ? '閉じる' : `他${sortedRecords.length - 3}件を表示`}
          </button>
        )}
      </div>

      {/* 新規記録フォーム (モーダル) */}
      {showNewRecordForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingRecord ? '記録を編集' : '新しい記録'}
              </h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              saveRecord()
            }} className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日付
                </label>
                <input type="date"
                       value={recordForm.date}
                       onChange={e => setRecordForm(prev => ({ ...prev, date: e.target.value }))}
                       className="input w-full"
                       required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    身長 (cm)
                  </label>
                  <input type="number"
                         step="0.1"
                         value={recordForm.height}
                         onChange={e => setRecordForm(prev => ({ ...prev, height: e.target.value }))}
                         className="input w-full"
                         required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    体重 (kg)
                  </label>
                  <input type="number"
                         step="0.1"
                         value={recordForm.weight}
                         onChange={e => setRecordForm(prev => ({ ...prev, weight: e.target.value }))}
                         className="input w-full"
                         required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メモ
                </label>
                <textarea value={recordForm.note}
                         onChange={e => setRecordForm(prev => ({ ...prev, note: e.target.value }))}
                         className="input w-full h-24 resize-none"></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button"
                        onClick={cancelEdit}
                        className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                  キャンセル
                </button>
                <button type="submit"
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

export default GrowthRecord