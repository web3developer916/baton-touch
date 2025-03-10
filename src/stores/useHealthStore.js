import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export const useHealthStore = create(
  persist(
    (set, get) => ({
      healthRecords: [],
      normalTemperatures: {},
      medications: [],
      illnesses: [],
      hospitalVisits: [],
      checkups: [],
      vaccinationRecords: [],
      loading: false,
      error: null,

      // 平熱を取得
      getChildNormalTemperature: (childId) => {
        return get().normalTemperatures[childId] || 36.5;
      },

      // 平熱を設定
      setNormalTemperature: (childId, temperature) => {
        set((state) => ({
          normalTemperatures: {
            ...state.normalTemperatures,
            [childId]: parseFloat(temperature),
          },
        }));
      },

      // 子供の病気記録を取得
      getChildIllnesses: (childId) => {
        return get()
          .illnesses.filter((illness) => illness.child_id === childId)
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      },

      // 子供の服薬記録を取得
      getChildMedications: (childId) => {
        return get()
          .medications.filter((med) => med.child_id === childId)
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      },

      getChildCheckups: (childId) => {
        return get()
          .checkups.filter((checkup) => checkup.child_id === childId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      getChildVaccinationRecords: (childId) => {
        return get()
          .vaccinationRecords.filter((r) => r.child_id === childId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      // getChildVaccinationRecords

      // 子供の全健康記録を取得
      getChildHealthRecords: (childId) => {
        const state = get();
        const records = [];

        // 体温記録
        records.push(
          ...state.healthRecords
            .filter((r) => r.child_id === childId)
            .map((r) => ({
              ...r,
              type: r.type,
              date: r.recorded_at,
            }))
        );

        // 病気記録
        records.push(
          ...state.illnesses
            .filter((i) => i.child_id === childId)
            .flatMap((illness) => {
              const records = [];

              // 病気の発症を記録
              records.push({
                id: `illness-${illness.id}`,
                type: "illness",
                title: `${illness.name}を発症`,
                date: illness.start_date,
                notes: illness.notes,
              });

              // 完治を記録
              if (illness.end_date) {
                records.push({
                  id: `recovery-${illness.id}`,
                  type: "recovery",
                  title: `${illness.name}が完治`,
                  date: illness.end_date,
                });
              }

              return records;
            })
        );

        // 服薬記録
        records.push(
          ...state.medications
            .filter((m) => m.child_id === childId)
            .map((m) => ({
              ...m,
              type: "medication",
              date: m.end_date || m.start_date,
              title: `服薬${m.end_date ? "終了" : "開始"}: ${m.name}`,
            }))
        );

        return records.sort((a, b) => new Date(b.date) - new Date(a.date));
      },

      // 健康記録を追加
      addHealthRecord: async (recordData) => {
        console.log(recordData, "recordData");
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("health_records")
            .insert([recordData])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            healthRecords: [data, ...state.healthRecords],
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      fetchIllnessesInfo: async (childId) => {
        console.log(childId, "childId");
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("illnesses_state")
            .select("*")
            .eq("child_id", childId)
            .order("created_at", { ascending: false });

          console.log(data, "getillnessesINfo");

          if (error) throw error;

          set((state) => ({
            illnesses: data,
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      addIllness: async (illnessInfo) => {
        console.log(illnessInfo, "illnessInfo");
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("illnesses_state")
            .insert([illnessInfo])
            .select()
            .single();

          console.log(data, "insertillnesses");

          if (error) throw error;

          set((state) => ({
            illnesses: [data, ...state.illnesses],
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      updateIllness: async (currentIllnessId, illnessInfo) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("illnesses_state")
            .update([illnessInfo])
            .eq("id", currentIllnessId)
            .select()
            .single();

          console.log(data, "insertillnesses");

          if (error) throw error;

          set((state) => ({
            illnesses: state.illnesses.map((illness) =>
              illness.id === currentIllnessId ? data : illness
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      deleteIllness: async (illnessId) => {
        try {
          set({ loading: true, error: null });
          await supabase.from("illnesses_state").delete().eq("id", illnessId);
          set((state) => {
            const currentIllnesses = state.illnesses.filter(
              (illness) => illness.id !== illnessId
            );
            return {
              illnesses: currentIllnesses,
              loading: false,
            };
          });
        } catch (error) {
          console.error("Error deleting llness:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      addMedication: async (medicationForm) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("medications")
            .insert([medicationForm])
            .select()
            .single();

          console.log(data, "insertmedication");

          if (error) throw error;

          set((state) => ({
            medications: [data, ...state.medications],
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      updateMedication: async (medicationId, updates) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("medications")
            .update(updates)
            .eq("id", medicationId)
            .select()
            .single();

          console.log(data, "updateMedication");

          if (error) throw error;

          set((state) => ({
            medications: state.medications.map((medication) =>
              medication.id === medicationId ? data : medication
            ),
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      deleteMedication: async (medicationId) => {
        try {
          set({ loading: true, error: null });
          await supabase.from("medications").delete().eq("id", medicationId);
          set((state) => {
            const currentMedications = state.medications.filter(
              (medication) => medication.id !== medicationId
            );
            return {
              medications: currentMedications,
              loading: false,
            };
          });
        } catch (error) {
          console.error("Error deleting medication:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },

      addCheckup: async (checkupForm) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("checkups")
            .insert([checkupForm])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            checkups: [data, ...state.checkups],
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      updateCheckup: async (checkupsId, checkups) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("checkups")
            .update(checkups)
            .eq("id", checkupsId)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            checkups: state.checkups.map((checkup) =>
              checkup.id === checkupsId ? data : checkup
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      deleteCheckup: async (checkupId) => {
        try {
          set({ loading: true, error: null });
          await supabase.from("checkups").delete().eq("id", checkupId);
          set((state) => {
            const currentCheckups = state.checkups.filter(
              (checkup) => checkup.id !== checkupId
            );
            return {
              checkups: currentCheckups,
              loading: false,
            };
          });
        } catch (error) {
          console.error("Error deleting medication:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      addVaccinationRecord: async (vaccinationRecord) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("vaccinations")
            .insert([vaccinationRecord])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            vaccinationRecords: [data, ...state.vaccinationRecords],
            loading: false,
          }));
        } catch (error) {
          console.error("��康記録の追加に失��:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      updateVaccinationRecord: async (recordId, updates) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from("vaccinations")
            .update(updates)
            .eq("id", recordId)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            vaccinationRecords: state.vaccinationRecords.map((record) =>
              record.id === recordId ? data : record
            ),
            loading: false,
          }));
        } catch (error) {
          console.error("健康記録の追加に失敗:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
      deleteVaccinationRecord: async (recordId) => {
        try {
          set({ loading: true, error: null });
          await supabase.from("vaccinations").delete().eq("id", recordId);
          set((state) => {
            const currentVaccinationRecords = state.vaccinationRecords.filter(
              (record) => record.id !== recordId
            );
            return {
              vaccinationRecords: currentVaccinationRecords,
              loading: false,
            };
          });
        } catch (error) {
          console.error("Error deleting vaccinations:", error);
          set({
            error: error.message,
            loading: false,
          });
        }
      },
    }),
    {
      name: "health-store",
    }
  )
);
