import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react'

const Terms = () => {
  const navigate = useNavigate()

  // ページマウント時に一番上にスクロール
  React.useEffect(() => {
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
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">利用規約</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        <div className="bg-white rounded-2xl p-6 shadow-warm">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-6">バトンタッチ利用規約</h2>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第1条（規約の適用）</h3>
              <p className="mb-4">本利用規約（以下「本規約」といいます）は、株式会社イノベスタ（以下「当社」といいます）が提供するスマートフォン用アプリケーション「バトンタッチ」（以下「本アプリ」といいます）の利用に関する条件を、本アプリをご利用になる方（以下「ユーザー」といいます）と当社との間で定めるものです。</p>
              <p>ユーザーは、本規約に同意の上、本アプリをご利用いただくものとします。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第2条（利用登録）</h3>
              <p className="mb-4">本アプリの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を行うものとします。</p>
              <p>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録を承認しないことがあります：</p>
              <ul className="list-disc list-inside mb-4">
                <li>虚偽の情報を提供した場合</li>
                <li>過去に本規約に違反したことがある場合</li>
                <li>その他、当社が利用登録を適当でないと判断した場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第3条（アカウント管理）</h3>
              <p className="mb-4">ユーザーは、自己の責任において、本アプリのアカウントを適切に管理するものとします。</p>
              <p>ユーザーは、いかなる場合にも、アカウントを第三者に譲渡または貸与することはできません。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第4条（禁止事項）</h3>
              <p className="mb-4">ユーザーは、本アプリの利用にあたり、以下の行為をしてはなりません：</p>
              <ul className="list-disc list-inside">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当社または第三者の知的財産権を侵害する行為</li>
                <li>当社または第三者の名誉を毀損または信用を失墜させる行為</li>
                <li>本アプリの運営を妨害する行為</li>
                <li>他のユーザーに不利益を与える行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第5条（サービスの提供の停止等）</h3>
              <p className="mb-4">当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本アプリの全部または一部の提供を停止または中断することができます：</p>
              <ul className="list-disc list-inside mb-4">
                <li>本アプリにかかるコンピューターシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、本アプリの提供が困難となった場合</li>
                <li>その他、当社が停止または中断を必要と判断した場合</li>
              </ul>
              <p>当社は、本条に基づき当社が行った措置によりユーザーに生じた損害について、一切の責任を負いません。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第6条（利用制限および登録抹消）</h3>
              <p className="mb-4">当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本アプリの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができます：</p>
              <ul className="list-disc list-inside mb-4">
                <li>本規約のいずれかの条項に違反した場合</li>
                <li>その他、当社が本アプリの利用を適当でないと判断した場合</li>
              </ul>
              <p>当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第7条（保証の否認および免責事項）</h3>
              <p className="mb-4">当社は、本アプリに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。</p>
              <p>当社は、本アプリに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第8条（サービス内容の変更等）</h3>
              <p>当社は、ユーザーに通知することなく、本アプリの内容を変更しまたは本アプリの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第9条（利用規約の変更）</h3>
              <p className="mb-4">当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>
              <p>変更後の規約は、当社ウェブサイトに掲示された時点より効力を生じるものとします。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第10条（個人情報の取扱い）</h3>
              <p>当社は、本アプリの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第11条（通知または連絡）</h3>
              <p>ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第12条（権利義務の譲渡の禁止）</h3>
              <p>ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第13条（準拠法・裁判管轄）</h3>
              <p className="mb-4">本規約の解釈にあたっては、日本法を準拠法とします。</p>
              <p>本アプリに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Terms