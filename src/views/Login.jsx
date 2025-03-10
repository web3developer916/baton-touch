import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
} from "lucide-react";
// import { signIn } from "../lib/auth";
import { useAuthStore } from "../lib/auth";
import { useFamilyStore } from "../stores/useFamilyStore";
import { useChildStore } from "../stores/useChildStore";
import { useHealthStore } from "../stores/useHealthStore";
import { useNoteStore } from "../stores/useNoteStore";
import { useTaskStore } from "../stores/useTaskStore";
import LoadingPage from "../components/common/LoadingPage";

const Login = () => {
  const navigate = useNavigate();
  const { fetchFamilies, families, selectedFamilyId } = useFamilyStore();
  const { fetchChildren, fetchDevelopmentInfo } = useChildStore();
  const { fetchIllnessesInfo } = useHealthStore();
  const { fetchNoteSettings, fetchNotes } = useNoteStore();
  const { fetchTasks } = useTaskStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const user = await signIn(loginForm);

      const currentFamilyId = await fetchFamilies(user.id);
      const currentChild = await fetchChildren(currentFamilyId);
      fetchNoteSettings(currentFamilyId);
      fetchNotes(currentFamilyId);
      fetchTasks(currentFamilyId);

      if (currentChild) {
        fetchDevelopmentInfo(currentChild);
        fetchIllnessesInfo(currentChild);
      }

      setLoading(false);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/child");
      }
    } catch (error) {
      setLoading(false);
      setError("メールアドレスまたはパスワードが正しくありません");
      console.error("Login error:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-warm p-6 space-y-6">
            <h2 className="text-xl font-bold text-center">ログイン</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="input w-full pl-10"
                    placeholder="example@email.com"
                    required
                  />
                  <MailIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="input w-full pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                ログイン
              </button>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                パスワードをお忘れの方
              </button>
            </div>
            <span className="flex items-center justify-center gap-3">
              <Link
                to="/settings/terms"
                className="text-primary-600 hover:text-primary-700"
                target="_blank"
              >
                利用規約
              </Link>
              <Link
                to="/settings/privacy"
                className="text-primary-600 hover:text-primary-700"
                target="_blank"
              >
                プライバシーポリシー
              </Link>
            </span>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                アカウントをお持ちでない方は
              </p>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                新規登録
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
