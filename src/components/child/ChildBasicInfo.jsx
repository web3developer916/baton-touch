import React, { useState, useRef } from 'react'
import { format, differenceInMonths, differenceInYears, parseISO } from 'date-fns'
import { User as UserIcon, Camera as CameraIcon, Pencil as PencilIcon, X as XIcon } from 'lucide-react'

const ChildBasicInfo = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState(value?.imageUrl)
  const fileInput = useRef(null)
  const [editForm, setEditForm] = useState({
    name: '',
    birthdate: '',
    gender: '',
    imageurl: ''
  })

  const age = React.useMemo(() => {
    if (!value.birthdate) return '年齢未設定'
    
    const birthdate = parseISO(value.birthdate)
    const years = differenceInYears(new Date(), birthdate)
    const months = differenceInMonths(new Date(), birthdate) % 12

    if (years === 0) {
      return `${months}ヶ月`
    } else {
      return `${years}歳${months}ヶ月`
    }
  }, [value.birthdate])

  const triggerImageUpload = () => {
    fileInput.current.click()
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (isEditing) {
          setEditForm(prev => ({ ...prev, imageUrl: e.target.result }))
        } else {
          setImageUrl(e.target.result)
          onChange({ ...value, imageUrl: e.target.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const startEditing = () => {
    setEditForm({
      name: value.name,
      birthDate: value.birthDate,
      gender: value.gender,
      imageUrl: value.imageUrl
    })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      name: '',
      birthDate: '',
      gender: '',
      imageUrl: ''
    })
  }

  const saveChanges = () => {
    onChange({
      ...value,
      ...editForm
    })
    setIsEditing(false)
  }

  React.useEffect(() => {
    if (isEditing) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
  }, [isEditing])

  React.useEffect(() => {
    setImageUrl(value?.imageUrl)
  }, [value?.imageUrl])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="子供の写真" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-primary-400" />
              )}
            </div>
            <button
              onClick={triggerImageUpload}
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white shadow-warm"
            >
              <CameraIcon className="w-5 h-5 text-primary-500" />
            </button>
            <input
              type="file"
              ref={fileInput}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{value.name || '名前を入力'}</h3>
            <p className="text-sm text-gray-500">{age}</p>
          </div>
        </div>
        <button
          onClick={startEditing}
          className="btn bg-primary-50 text-primary-600 hover:bg-primary-100"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">子供情報を編集</h3>
              <button
                onClick={cancelEdit}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前 (漢字)
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  生年月日
                </label>
                <input
                  type="date"
                  value={editForm.birthDate}
                  onChange={e => setEditForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性別
                </label>
                <select
                  value={editForm.gender}
                  onChange={e => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="male">男の子</option>
                  <option value="female">女の子</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={saveChanges}
                  className="btn btn-primary"
                >
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

export default ChildBasicInfo