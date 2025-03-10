import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],
      noteSettings: [],
      loading: false,
      error: null,

      // メモ一覧を取得
      fetchNotes: async (familyGroupId) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("notes")
            .select(
              `
              *,
              children (
                name
              ),
              profiles (
                name
              )
            `
            )
            .eq("family_group_id", familyGroupId)
            .order("created_at", { ascending: false });

          if (error) throw error;

          set({
            notes: data,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching notes:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      getNotes: async (familyGroupId) => {
        console.log(notes, "familyGroupId_notes");
        
      //   return get()
      //     .notes.filter((note) => note.genre === genre)
      //     .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      },

      // メモを追加
      addNote: async (noteData) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("notes")
            .insert([noteData])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            notes: [data, ...state.notes],
            loading: false,
          }));
        } catch (error) {
          console.error("Error adding note:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // メモを更新
      updateNote: async (noteId, updates) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("notes")
            .update(updates)
            .eq("id", noteId)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === noteId ? data : note
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error updating note:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // メモを削除
      deleteNote: async (noteId) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", noteId);

          if (error) throw error;

          set((state) => ({
            notes: state.notes.filter((note) => note.id !== noteId),
            loading: false,
          }));
        } catch (error) {
          console.error("Error deleting note:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      // ジャンルごとのメモを取得
      getNotesByGenre: (genre) => {
        console.log(genre, "Genre");

        return get()
          .notes.filter((note) => note.genre === genre)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      },

      updateNoteSetting: async (noteSettingId, updates) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("note_settings")
            .update(updates)
            .eq("id", noteSettingId)
            .select()
            .single();
          if (error) throw error;

          set((state) => ({
            noteSettings: state.noteSettings.map((noteSetting) =>
              noteSetting.id === noteSettingId ? data : noteSetting
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("Error updating noteSettings:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      fetchNoteSettings: async (familyGroupId) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("note_settings")
            .select(`*`)
            .eq("family_group_id", familyGroupId);
          if (error) throw error;

          console.log(data, "noteSettings");

          set({
            noteSettings: data,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching noteSettings:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      getNoteSettings: (familyGroupId) => {
        return get().noteSettings.filter(
          (noteSetting) => noteSetting.family_group_id === familyGroupId
        );
      },
    }),
    {
      name: "note-store",
    }
  )
);
