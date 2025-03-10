import { useState } from "react";

export default function PasswordResetForm({ onResetRequest }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await onResetRequest(email);
      setMessage("パスワードリセットリンクを送信しました。");
    } catch (error) {
      setMessage("エラーが発生しました。");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">パスワードリセット</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="登録済みメールアドレス"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
          リセットメール送信
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
