import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft as ArrowLeftIcon, Search as SearchIcon,
  ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon,
  MailQuestion as QuestionMarkIcon
} from 'lucide-react'

const FAQ = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  // カテゴリー一覧
  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'account', name: 'アカウント' },
    { id: 'family', name: '家族グループ' },
    { id: 'record', name: '記録' },
    { id: 'health', name: '健康記録' },
    { id: 'notes', name: '育児メモ' },
    { id: 'tasks', name: 'タスク' }
  ]

  // FAQ一覧
  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'パスワードを忘れてしまいました',
      answer: 'ログイン画面の「パスワードを忘れた方」をタップし、登録したメールアドレスを入力してください。パスワードリセットのメールが送信されます。'
    },
    {
      id: 2,
      category: 'account',
      question: 'メールアドレスを変更したい',
      answer: '設定 > アカウント > メールアドレスから変更できます。変更には現在のパスワードが必要です。'
    },
    {
      id: 3,
      category: 'family',
      question: '家族グループに招待されました',
      answer: '招待メールに記載されているリンクをタップし、アカウントを作成またはログインすることで、グループに参加できます。'
    },
    {
      id: 4,
      category: 'record',
      question: '記録を削除してしまいました',
      answer: '一度削除した記録は復元できません。削除する前に確認メッセージが表示されます。'
    },
    {
      id: 5,
      category: 'health',
      question: '予防接種の記録はどこで確認できますか？',
      answer: '健康タブから「予防接種」を選択すると、接種履歴や予定を確認できます。'
    }
  ]

  // 検索とカテゴリーでフィルタリングされたFAQ
  const filteredFaqs = faqs.filter(faq => {
    // カテゴリーでフィルター
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
      return false
    }

    // 検索クエリでフィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      )
    }

    return true
  })

  // FAQの展開/折りたたみ
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  // ページマウント時にトップにスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <button onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-gray-100 rounded-xl text-gray-600">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">よくある質問</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        {/* カテゴリー選択 */}
        <div className="flex space-x-2 overflow-x-auto pb-4">
          {categories.map(category => (
            <button key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}>
              {category.name}
            </button>
          ))}
        </div>

        {/* 検索バー */}
        <div className="relative mb-6">
          <input type="text"
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 placeholder="質問を検索..."
                 className="input w-full pl-10 py-3" />
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* FAQ一覧 */}
        <div className="space-y-4">
          {filteredFaqs.map(faq => (
            <div key={faq.id}
                 className="bg-white rounded-2xl shadow-warm">
              <button onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-start justify-between p-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-50 rounded-xl flex-shrink-0">
                    <QuestionMarkIcon className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="font-medium">{faq.question}</span>
                </div>
                {expandedFaq === faq.id ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                )}
              </button>
              
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4">
                  <div className="ml-10 pl-3 border-l-2 border-gray-100">
                    <p className="text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 質問が見つからない場合 */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">
              {searchQuery ? '検索結果が見つかりませんでした' : '質問が見つかりません'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default FAQ