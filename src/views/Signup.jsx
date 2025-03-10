import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  ArrowLeft as ArrowLeftIcon,
  Users as UsersIcon,
} from "lucide-react";
// import { signUp } from "../lib/auth";
import { useAuthStore } from "../lib/auth";
import { useFamilyStore } from "../stores/useFamilyStore";
import { useChildStore } from "../stores/useChildStore";
import { useHealthStore } from "../stores/useHealthStore";
import { useNoteStore } from "../stores/useNoteStore";
import { useTaskStore } from "../stores/useTaskStore";
import LoadingPage from "../components/common/LoadingPage";

const Signup = () => {
  const { signUp } = useAuthStore();
  const { fetchFamilies, families, selectedFamilyId, addFamily } =
    useFamilyStore();
  const { fetchChildren, fetchDevelopmentInfo } = useChildStore();
  const { fetchIllnessesInfo } = useHealthStore();
  const { fetchNoteSettings, fetchNotes } = useNoteStore();
  const { fetchTasks } = useTaskStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    familyGroup: {
      create: false,
      name: "",
    },
    agreedToTerms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }
    if (!signupForm.agreedToTerms) {
      alert("利用規約とプライバシーポリシーに同意してください");
      return;
    }
    setLoading(true);

    const user = await signUp({
      email: signupForm.email,
      password: signupForm.password,
      name: signupForm.name,
    });
    console.log(user, "user_test");

    const currentFamilyId = await fetchFamilies(user.id);
    const familyId = await addFamily(signupForm.familyGroup.name, user.id);
    // const familyfech = await fetchChildren(familyId);
    // const currentFamilyId = await fetchFamilies(user.id);
    const currentChild = await fetchChildren(familyId);
    fetchNoteSettings(familyId);
    fetchNotes(familyId);
    fetchTasks(familyId);

    if (currentChild) {
      fetchDevelopmentInfo(currentChild);
      fetchIllnessesInfo(currentChild);
    }

    console.log(user, "usersignup");
    console.log(familyId, "familyId");
    // console.log(familyfech, "familyfech");

    // if (error) throw error;
    // console.log(user, "user111");

    // Create profile
    // const { data: profile, error: profileError } = await supabase
    //   .from("profiles")
    //   .insert([
    //     {
    //       id: user.id,
    //       email: signupForm.email,
    //     },
    //   ])
    //   .select()
    //   .single();
    // console.log(profile, "profile");
    setLoading(false);

    if (user) navigate("/child");
  };

  if (loading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-warm p-6">
          <div className="flex items-start mb-6">
            <button
              onClick={() => navigate("/login")}
              className="p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-center flex-1">
              アカウントを登録
            </h2>
            {/* <button onClick={() => handleSubmitch()}>Check</button> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                親の名前（ひらがな）
              </label>
              <input
                type="text"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input w-full"
                placeholder="例：やまと"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
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
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="input w-full pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
              <p className="mt-1 text-sm text-gray-500">
                6文字以上で入力してください
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード（確認）
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="input w-full pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <UsersIcon className="w-5 h-5 text-primary-500" />
                <span>家族グループ</span>
              </label>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  グループ名
                </label>
                <input
                  type="text"
                  value={signupForm.familyGroup.name}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      familyGroup: {
                        ...prev.familyGroup,
                        name: e.target.value,
                      },
                    }))
                  }
                  className="input w-full"
                  placeholder="例：山田家"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  ※既存の家族グループに参加する場合は、登録後に管理者から招待を受けてください
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={signupForm.agreedToTerms}
                  onChange={(e) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      agreedToTerms: e.target.checked,
                    }))
                  }
                  className="input mt-1"
                />
                <span className="text-sm text-gray-600">
                  <Link
                    to="/settings/terms"
                    className="text-primary-600 hover:text-primary-700"
                    target="_blank"
                  >
                    利用規約
                  </Link>
                  と
                  <Link
                    to="/settings/privacy"
                    className="text-primary-600 hover:text-primary-700"
                    target="_blank"
                  >
                    プライバシーポリシー
                  </Link>
                  に同意します
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6">
              登録する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
