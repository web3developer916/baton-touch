import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react'

const Privacy = () => {
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
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">プライバシーポリシー</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        <div className="bg-white rounded-2xl p-6 shadow-warm">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-6">プライバシーポリシー</h2>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">はじめに</h3>
              <p>当社は、スマートフォンアプリケーション「バトンタッチ」（以下「本アプリ」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第1条（個人情報の定義）</h3>
              <p>本ポリシーにおいて「個人情報」とは、個人情報保護法第2条第1項により定義される個人情報を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレスその他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含みます）を指します。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第2条（取得する情報の種類）</h3>
              <p className="mb-4">当社は、本アプリの提供にあたり、以下の情報を取得します：</p>

              <h4 className="font-bold mb-2">ユーザーが入力する情報</h4>
              <ul className="list-disc list-inside mb-4">
                <li>氏名</li>
                <li>メールアドレス</li>
                <li>電話番号</li>
                <li>パスワード</li>
                <li>その他アカウント情報</li>
              </ul>

              <h4 className="font-bold mb-2">端末情報</h4>
              <ul className="list-disc list-inside mb-4">
                <li>デバイスの機種</li>
                <li>OSのバージョン</li>
                <li>端末識別子</li>
                <li>IPアドレス</li>
              </ul>

              <h4 className="font-bold mb-2">利用情報</h4>
              <ul className="list-disc list-inside">
                <li>アプリの利用履歴</li>
                <li>アクセスログ</li>
                <li>クラッシュレポート</li>
                <li>利用統計情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第3条（利用目的）</h3>
              <p className="mb-4">当社は、取得した情報を以下の目的で利用します：</p>
              <ul className="list-disc list-inside">
                <li>本アプリの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに対応するため</li>
                <li>利用規約に違反する行為に対応するため</li>
                <li>本アプリの改善及び新機能の開発のため</li>
                <li>利用状況の分析、統計データの作成のため</li>
                <li>不正アクセスの防止のため</li>
                <li>当社からのお知らせや情報提供のため</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第4条（第三者提供）</h3>
              <p className="mb-4">当社は、以下の場合を除き、ユーザーの同意を得ることなく、第三者に個人情報を提供することはありません：</p>
              <ul className="list-disc list-inside mb-4">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
              </ul>
              <p className="mb-4">前項の定めにかかわらず、以下の場合は第三者提供には該当しないものとします：</p>
              <ul className="list-disc list-inside">
                <li>当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合</li>
                <li>合併その他の事由による事業の承継に伴って個人情報が提供される場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第5条（情報の管理）</h3>
              <p className="mb-4">当社は、ユーザーの個人情報を正確かつ最新の状態に保持し、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、適切なセキュリティ対策を実施します。</p>
              <p>当社は、個人情報の取扱いの全部または一部を委託する場合は、委託先において個人情報の安全管理が図られるよう、必要かつ適切な監督を行います。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第6条（プライバシーポリシーの変更）</h3>
              <p className="mb-4">本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。</p>
              <p>変更後のプライバシーポリシーは、当社ウェブサイトに掲載したときから効力を生じるものとします。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第7条（個人情報の開示・訂正・利用停止等）</h3>
              <p className="mb-4">当社は、ユーザーから個人情報の開示・訂正・利用停止等の請求があった場合、本人確認を行った上で、法令に基づき適切に対応します。</p>
              <p>前項の請求にあたっては、当社所定の手続きに従っていただき、手数料が必要となる場合があります。</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3">第8条（お問い合わせ窓口）</h3>
              <p>本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。</p>
              <div className="mt-4">
                <p>株式会社イノベスタ</p>
                <p>住所：埼玉県さいたま市大宮区桜木町1-378 BIZcomfort大宮西口6F-33</p>
                <p>メール：info@innovesta.jp</p>
                <p>電話：048-700-7084</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Privacy