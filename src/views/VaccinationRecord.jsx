import React from "react";
import { useHealthStore } from "../stores/useHealthStore";
import { useChildStore } from "../stores/useChildStore";
import VaccinationRecord from "../components/health/VaccinationRecord";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VaccinationRecordView = () => {
  const navigate = useNavigate();
  const healthStore = useHealthStore();
  const childStore = useChildStore();

  const addVaccinationRecord = (record) => {
    healthStore.addVaccinationRecord({
      ...record,
      child_id: childStore.selectedChildId,
    });
  };

  const updateVaccinationRecord = (recordId, recordForm) => {
    healthStore.updateVaccinationRecord(recordId, recordForm);
  };

  const deleteVaccinationRecord = (recordId) => {
    healthStore.deleteVaccinationRecord(recordId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
            予防接種記録
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24">
        <VaccinationRecord
          records={
            healthStore.getChildVaccinationRecords(
              childStore.selectedChildId
            ) || []
          }
          birthDate={childStore.selectedChild?.birthDate}
          onAdd={addVaccinationRecord}
          onUpdate={updateVaccinationRecord}
          onDelete={deleteVaccinationRecord}
        />
      </main>
    </div>
  );
};

export default VaccinationRecordView;
