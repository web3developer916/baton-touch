import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export const useChildStore = create(
  persist(
    (set, get) => ({
      children: [],
      selectedChildId: null,
      loading: false,
      error: null,
      developmentInfo: [],
      vaccinationRecords: [],

      // 子供一覧を取得
      fetchChildren: async (familyGroupId) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("children")
            .select("*")
            .eq("family_group_id", familyGroupId)
            .order("updated_at", { ascending: false });

          if (error) throw error;

          set({
            children: data,
            loading: false,
          });

          // 最初の子供を選択
          // if (data.length > 0 && !get().selectedChildId) {
          if (data.length > 0 ) {
            set({ selectedChildId: data[0].id });
            return data[0].id;
          }
          // }
          // return get().selectedChildId;
        } catch (error) {
          console.error("Error fetching children:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      // getChildren: async (familyGroupId) => {
      //   return get()
      //   .children.filter((child) => child.child_id === childId)
      //   .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      // }
      setCurrentChildInfo: async (childId) => {
        set((state) => ({
          selectedChildId: childId,
        }));
      },

      // 子供を追加
      addChild: async (childData) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("children")
            .insert([childData])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            children: [data, ...state.children],
            selectedChildId: data.id,
            loading: false,
          }));

          return data.id;
        } catch (error) {
          console.error("Error adding child:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // 子供を更新
      updateChild: async (id, updates) => {
        try {
          // selectedChildIdは更新対象から除外
          const { selectedChildId, ...updateData } = updates;

          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("children")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            children: state.children.map((child) =>
              child.id === id ? data : child
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error updating child:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      fetchDevelopmentInfo: async (childId) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("development_records")
            .select("*")
            .eq("child_id", childId)
            .order("created_at", { ascending: false });

          set({
            developmentInfo: data,
            loading: false,
          });
          if (error) throw error;
        } catch (error) {
          console.error("Error fetching developmentInfo:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      updateDevelopmentInfo: async (updateDevelopment) => {
        try {
          set({ loading: true, error: null });

          const { data: existingRecords, error: fetchError } = await supabase
            .from("development_records")
            .select("*")
            .eq("child_id", updateDevelopment.child_id)
            .eq("milestone", updateDevelopment.milestone)
            .single();

          if (existingRecords) {
            const { data: updatedRecord, error: updateError } = await supabase
              .from("development_records")
              .update(updateDevelopment)
              .eq("id", existingRecords.id)
              .select()
              .single();

            if (updateError) throw updateError;
            set((state) => ({
              developmentInfo: state.developmentInfo.map((development) =>
                development.milestone === updateDevelopment.milestone
                  ? updatedRecord
                  : development
              ),
              loading: false,
            }));
          } else {
            const { data, error } = await supabase
              .from("development_records")
              .insert([updateDevelopment])
              .select()
              .single();

            if (error) throw error;
            set((state) => ({
              developmentInfo: [...state.developmentInfo, data],
              loading: false,
            }));
          }
        } catch (error) {
          console.error("Error updating child:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // 子供を削除
      deleteChild: async (id) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from("children")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set((state) => {
            const newChildren = state.children.filter(
              (child) => child.id !== id
            );
            return {
              children: newChildren,
              selectedChildId:
                newChildren.length > 0 ? newChildren[0].id : null,
              loading: false,
            };
          });
        } catch (error) {
          console.error("Error deleting child:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      // getChildVaccinationRecords: async (childId) => {
      //   try {
      //     set({ loading: true, error: null });
      //     const { data, error } = await supabase
      //       .from("vaccinations")
      //       .select("*")
      //       .eq("child_id", childId)
      //       .order("created_at", { ascending: false });

      //     set({
      //       vaccinationRecords: data,
      //       loading: false,
      //     });
      //     if (error) throw error;
      //   } catch (error) {
      //     console.error("Error fetching vaccination records:", error);
      //     set({
      //       error: error.message,
      //       loading: false,
      //     });
      //   }
      // },

      initialize: async () => {
        try {
          set({ loading: true, error: null });
          set((state) => ({
            children: [],
            selectedChildId: null,
            loading: false,
            error: null,
          }));
        } catch (error) {
          console.error("Error initializing child:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
    }),
    {
      name: "child-store",
    }
  )
);
