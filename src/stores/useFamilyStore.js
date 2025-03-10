import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export const useFamilyStore = create(
  persist(
    (set, get) => ({
      families: [],
      selectedFamilyId: null,
      loading: false,
      error: null,

      // 選択中の家族グループを更新
      updateSelectedFamily: (id) => set({ selectedFamilyId: id }),

      // 家族グループ一覧を取得
      fetchFamilies: async (userId) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("family_groups")
            .select(
              `
              *,
              family_members (
                id,
                user_id,
                role,
                profiles (
                  id,
                  name
                )
              )
            `
            )
            // .eq("profiles.id", userId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          console.log(data, "familydata");

          // 自分が所属している家族グループのみをフィルタリング;
          const myFamilies = await data.filter((family) =>
            family.family_members.some((member) => member.user_id === userId)
          );

          await set({
            families: myFamilies,
            loading: false,
          });

          console.log(myFamilies, "fds");

          // 最初の家族グループを選択
          // if (myFamilies.length > 0 && !get().selectedFamilyId) {
          await set({ selectedFamilyId: myFamilies[0].id });
          return myFamilies[0].id;

          // }

          // set(() => ({
          //   selectedFamilyId: myFamilies[0].id,
          // }));
        } catch (error) {
          console.error("Error fetching families:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // 家族グループを作成
      addFamily: async (name, userId) => {
        try {
          set({ loading: true, error: null });

          console.log(name, userId);

          // 家族グループを作成
          const { data: family, error: familyError } = await supabase
            .from("family_groups")
            .insert([{ name }])
            .select()
            .single();

          if (familyError) throw familyError;

          // 作成者を管理者として追加
          const { error: memberError } = await supabase
            .from("family_members")
            .insert([
              {
                family_group_id: family.id,
                user_id: userId,
                role: "admin",
              },
            ]);

          if (memberError) throw memberError;

          // 最新の家族グループ情報を取得
          const { data: updatedFamily, error: fetchError } = await supabase
            .from("family_groups")
            .select(
              `
              *,
              family_members (
                id,
                user_id,
                role,
                profiles (
                  id,
                  name
                )
              )
            `
            )
            .eq("id", family.id)
            .single();

          if (fetchError) throw fetchError;

          const { error: noteSettingError } = await supabase
            .from("note_settings")
            .insert([
              {
                family_group_id: family.id,
                created_by: userId,
                visibleGenreIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              },
            ]);

          if (noteSettingError) throw noteSettingError;

          console.log();

          set((state) => ({
            families: [updatedFamily, ...state.families],
            selectedFamilyId: updatedFamily.id,
            loading: false,
          }));

          return updatedFamily.id;
        } catch (error) {
          console.error("Error adding family:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // 家族グループを更新
      updateFamily: async (id, updates) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("family_groups")
            .update(updates)
            .eq("id", id)
            .select(
              `
              *,
              family_members (
                id,
                user_id,
                role,
                profiles (
                  id,
                  name
                )
              )
            `
            )
            .single();

          if (error) throw error;

          set((state) => ({
            families: state.families.map((family) =>
              family.id === id ? data : family
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error updating family:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // 家族グループを削除
      deleteFamily: async (id) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from("family_groups")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set((state) => {
            const newFamilies = state.families.filter((f) => f.id !== id);
            return {
              families: newFamilies,
              selectedFamilyId:
                newFamilies.length > 0 ? newFamilies[0].id : null,
              loading: false,
            };
          });
        } catch (error) {
          console.error("Error deleting family:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // メンバーを追加
      addMember: async (familyId, addData) => {
        try {
          console.log(familyId, addData, "adding");
          set({ loading: true, error: null });

          // メールアドレスからユーザーを検索
          const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", addData.email)
            .single();

          if (profileError) throw new Error("ユーザーが見つかりません");

          console.log(profiles, "profiles");

          // メンバーとして追加
          const { error: memberError } = await supabase
            .from("family_members")
            .insert([
              {
                family_group_id: familyId,
                user_id: profiles.id,
                role: addData.role,
              },
            ]);

          if (memberError) throw memberError;

          // 最新の家族グループ情報を取得
          const { data: updatedFamily, error: fetchError } = await supabase
            .from("family_groups")
            .select(
              `
              *,
              family_members (
                id,
                user_id,
                role,
                profiles (
                  id,
                  name
                )
              )
            `
            )
            .eq("id", familyId)
            .single();

          if (fetchError) throw fetchError;

          set((state) => ({
            families: state.families.map((family) =>
              family.id === familyId ? updatedFamily : family
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error adding member:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // メンバーを削除
      removeMember: async (familyId, memberId) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from("family_members")
            .delete()
            .eq("id", memberId);

          if (error) throw error;

          // 最新の家族グループ情報を取得
          const { data: updatedFamily, error: fetchError } = await supabase
            .from("family_groups")
            .select(
              `
              *,
              family_members (
                id,
                user_id,
                role,
                profiles (
                  id,
                  name
                )
              )
            `
            )
            .eq("id", familyId)
            .single();

          if (fetchError) throw fetchError;

          set((state) => ({
            families: state.families.map((family) =>
              family.id === familyId ? updatedFamily : family
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error removing member:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
    }),
    {
      name: "family-store",
    }
  )
);
