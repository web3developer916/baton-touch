import React, { useState, useEffect } from 'react'
import { Pencil as PencilIcon, ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon, Plus as PlusIcon } from 'lucide-react'

const PersonalityInfo = ({ personalityInfo, onUpdate }) => {
  const [sleepInfo, setSleepInfo] = useState({
    bedtime: '',
    wakeTime: '',
    napTime: '',
    routine: '',
    nightCrying: ''
  })

  const [foodInfo, setFoodInfo] = useState({
    likes: '',
    dislikes: '',
    drinks: '',
    notes: ''
  })

  const [playInfo, setPlayInfo] = useState({
    favorites: '',
    toys: '',
    tips: ''
  })

  // 編集状態の管理
  const [isEditingSleep, setIsEditingSleep] = useState(false)
  const [isEditingFood, setIsEditingFood] = useState(false)
  const [isEditingPlay, setIsEditingPlay] = useState(false)

  // 展開状態の管理
  const [isSleepExpanded, setIsSleepExpanded] = useState(true)
  const [isFoodExpanded, setIsFoodExpanded] = useState(true)
  const [isPlayExpanded, setIsPlayExpanded] = useState(true)

  // 情報が入力されているかどうかを判定
  const hasSleepInfo = Boolean(
    sleepInfo.bedtime || 
    sleepInfo.wakeTime || 
    sleepInfo.napTime ||
    sleepInfo.routine || 
    sleepInfo.nightCrying
  )

  const hasFoodInfo = Boolean(
    foodInfo.likes || 
    foodInfo.dislikes || 
    foodInfo.drinks ||
    foodInfo.notes
  )

  const hasPlayInfo = Boolean(
    playInfo.favorites || 
    playInfo.toys || 
    playInfo.tips
  )

  // 値が変更されたら親コンポーネントに通知
  useEffect(() => {
    onUpdate({
      sleepHabits: sleepInfo,
      foodPreferences: foodInfo,
      playPreferences: playInfo
    })
  }, [sleepInfo, foodInfo, playInfo])

  // 初期値の設定
  useEffect(() => {
    if (personalityInfo) {
      const { sleepHabits, foodPreferences, playPreferences } = personalityInfo
      
      if (sleepHabits) {
        setSleepInfo(sleepHabits)
      }
      if (foodPreferences) {
        setFoodInfo(foodPreferences)
      }
      if (playPreferences) {
        setPlayInfo(playPreferences)
      }
    }
  }, [personalityInfo])

  return (
    <div className="space-y-6">
      {/* 睡眠習慣 */}
      <div className="card relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">睡眠習慣</h3>
          <div className="flex space-x-2">
            {hasSleepInfo ? (
              <button onClick={() => setIsEditingSleep(!isEditingSleep)} 
                      className="p-2 hover:text-primary-600 transition-colors">
                <PencilIcon className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setIsEditingSleep(true)} 
                      className="p-2 text-primary-600 hover:text-primary-700">
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setIsSleepExpanded(!isSleepExpanded)}
                    className="p-2 hover:text-primary-600 transition-colors">
              {isSleepExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        {isSleepExpanded && (
          <div className="space-y-4">
            {!isEditingSleep ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">就寝時間</p>
                    <p className="font-medium">{sleepInfo.bedtime || '未設定'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">起床時間</p>
                    <p className="font-medium">{sleepInfo.wakeTime || '未設定'}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">昼寝の時間</p>
                  <p className="whitespace-pre-wrap">{sleepInfo.napTime || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">寝かしつけ方</p>
                  <p className="whitespace-pre-wrap">{sleepInfo.routine || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">夜泣き対策</p>
                  <p className="whitespace-pre-wrap">{sleepInfo.nightCrying || '未設定'}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    睡眠時間
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">就寝時間</label>
                      <input type="time"
                             value={sleepInfo.bedtime}
                             onChange={e => setSleepInfo(prev => ({ ...prev, bedtime: e.target.value }))}
                             className="input w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">起床時間</label>
                      <input type="time"
                             value={sleepInfo.wakeTime}
                             onChange={e => setSleepInfo(prev => ({ ...prev, wakeTime: e.target.value }))}
                             className="input w-full" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    昼寝の時間
                  </label>
                  <textarea value={sleepInfo.napTime}
                           onChange={e => setSleepInfo(prev => ({ ...prev, napTime: e.target.value }))}
                           className="input w-full h-24 resize-none"
                           placeholder="例：午前10時〜11時、午後2時〜3時半など"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    寝かしつけ方
                  </label>
                  <textarea value={sleepInfo.routine}
                           onChange={e => setSleepInfo(prev => ({ ...prev, routine: e.target.value }))}
                           className="input w-full h-24 resize-none"
                           placeholder="例：お気に入りの音楽を流しながら、絵本を読んであげる"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    夜泣き対策
                  </label>
                  <textarea value={sleepInfo.nightCrying}
                           onChange={e => setSleepInfo(prev => ({ ...prev, nightCrying: e.target.value }))}
                           className="input w-full h-24 resize-none"
                           placeholder="例：軽くトントンしながら、優しく声をかける"></textarea>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 食事の好み */}
      <div className="card relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">食事の好み</h3>
          <div className="flex space-x-2">
            {hasFoodInfo ? (
              <button onClick={() => setIsEditingFood(!isEditingFood)}
                      className="p-2 hover:text-primary-600 transition-colors">
                <PencilIcon className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setIsEditingFood(true)} 
                      className="p-2 text-primary-600 hover:text-primary-700">
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setIsFoodExpanded(!isFoodExpanded)}
                    className="p-2 hover:text-primary-600 transition-colors">
              {isFoodExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        {isFoodExpanded && (
          <div className="space-y-4">
            {!isEditingFood ? (
              <>
                <div>
                  <p className="text-sm text-gray-500">好きな食べ物</p>
                  <p className="whitespace-pre-wrap">{foodInfo.likes || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">嫌いな食べ物</p>
                  <p className="whitespace-pre-wrap">{foodInfo.dislikes || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">好きな飲み物</p>
                  <p className="whitespace-pre-wrap">{foodInfo.drinks || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">食事の注意点</p>
                  <p className="whitespace-pre-wrap">{foodInfo.notes || '未設定'}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    好きな食べ物
                  </label>
                  <textarea value={foodInfo.likes}
                           onChange={e => setFoodInfo(prev => ({ ...prev, likes: e.target.value }))}
                           className="input w-full h-24 resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    嫌いな食べ物
                  </label>
                  <textarea value={foodInfo.dislikes}
                           onChange={e => setFoodInfo(prev => ({ ...prev, dislikes: e.target.value }))}
                           className="input w-full h-24 resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    好きな飲み物
                  </label>
                  <textarea value={foodInfo.drinks}
                           onChange={e => setFoodInfo(prev => ({ ...prev, drinks: e.target.value }))}
                           className="input w-full h-24 resize-none"
                           placeholder="例：麦茶、りんごジュース、お茶など"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    食事の注意点
                  </label>
                  <textarea value={foodInfo.notes}
                           onChange={e => setFoodInfo(prev => ({ ...prev, notes: e.target.value }))}
                           className="input w-full h-24 resize-none"
                           placeholder="例：小さく切り分ける、熱すぎない温度に注意"></textarea>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 遊びの好み */}
      <div className="card relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">遊びの好み</h3>
          <div className="flex space-x-2">
            {hasPlayInfo ? (
              <button onClick={() => setIsEditingPlay(!isEditingPlay)}
                      className="p-2 hover:text-primary-600 transition-colors">
                <PencilIcon className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setIsEditingPlay(true)} 
                      className="p-2 text-primary-600 hover:text-primary-700">
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setIsPlayExpanded(!isPlayExpanded)}
                    className="p-2 hover:text-primary-600 transition-colors">
              {isPlayExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        {isPlayExpanded && (
          <div className="space-y-4">
            {!isEditingPlay ? (
              <>
                <div>
                  <p className="text-sm text-gray-500">好きな遊び</p>
                  <p className="whitespace-pre-wrap">{playInfo.favorites || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">おもちゃ</p>
                  <p className="whitespace-pre-wrap">{playInfo.toys || '未設定'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">遊び方のコツ</p>
                  <p className="whitespace-pre-wrap">{playInfo.tips || '未設定'}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    好きな遊び
                  </label>
                  <textarea value={playInfo.favorites}
                           onChange={e => setPlayInfo(prev => ({ ...prev, favorites: e.target.value }))}
                           className="input w-full h-24 resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    おもちゃ
                  </label>
                  <textarea value={playInfo.toys}
                           onChange={e => setPlayInfo(prev => ({ ...prev, toys: e.target.value }))}
                           className="input w-full h-24 resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    遊び方のコツ
                  </label>
                  <textarea value={playInfo.tips}
                           onChange={e => setPlayInfo(prev => ({ ...prev, tips: e.target.value }))}
                           className="input w-full h-24 resize-none"
                           placeholder="例：一緒に歌を歌うと喜ぶ、スキンシップを好む"></textarea>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalityInfo