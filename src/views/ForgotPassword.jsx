import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail as MailIcon, ArrowLeft as ArrowLeftIcon } from "lucide-react";
import { useAuthStore } from "../lib/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendPasswordReset } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: パスワードリセットメール送信処理
    sendPasswordReset(email);
    console.log(email, "email");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-warm p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">メールを送信しました</h2>
            <p className="text-gray-600 mb-6">
              パスワードリセットの手順を記載したメールを送信しました。
              メールの指示に従ってパスワードを再設定してください。
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary w-full"
            >
              ログイン画面に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-warm p-6">
          <button
            onClick={() => navigate("/login")}
            className="p-2 -ml-2 text-gray-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold mb-6">パスワードをリセット</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="example@email.com"
                  required
                />
                <MailIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                登録時のメールアドレスを入力してください
              </p>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              パスワードリセットメールを送信
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
