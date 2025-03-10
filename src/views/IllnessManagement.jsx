import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChildStore } from "../stores/useChildStore";
import { useHealthStore } from "../stores/useHealthStore";
import { ArrowLeft as ArrowLeftIcon, Plus as PlusIcon } from "lucide-react";
import IllnessForm from "../components/health/IllnessForm";
import IllnessCard from "../components/health/IllnessCard";
import IllnessDetail from "../components/health/IllnessDetail";
import VisitForm from "../components/health/VisitForm";
import MedicationForm from "../components/health/MedicationForm";
import SymptomForm from "../components/health/SymptomForm";

const IllnessManagement = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [showNewIllnessForm, setShowNewIllnessForm] = useState(false);
  const [showNewSymptomForm, setShowNewSymptomForm] = useState(false);
  const [showNewVisitForm, setShowNewVisitForm] = useState(false);
  const [showNewMedicationForm, setShowNewMedicationForm] = useState(false);
  const [expandedIllness, setExpandedIllness] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [editingIllness, setEditingIllness] = useState(false);
  const [currentIllnessId, setCurrentIllnessId] = useState(null);

  const childStore = useChildStore();
  const healthStore = useHealthStore();
  const illnesses = healthStore.getChildIllnesses(childStore.selectedChildId);

  // 現在表示中の病気情報を取得
  const currentIllness = expandedIllness
    ? illnesses.find((i) => i.id === expandedIllness.id)
    : null;
  // const currentIllness = expandedIllness
  //   ? illnesses.find(i => i.id === expandedIllness.id)
  //   : null

  const [illnessForm, setIllnessForm] = useState({
    name: "",
    start_date: new Date(),
    notes: "",
    symptoms: [],
    otherSymptom: "",
    symptomDescriptions: {},
  });

  const availableSymptoms = [
    "発熱",
    "咳",
    "鼻水",
    "鼻づまり",
    "嘔吐",
    "寒気",
    "腹痛",
    "下痢",
    "発疹",
    "食欲不振",
    "機嫌が悪い",
    "その他",
  ];

  useEffect(() => {
    if (currentIllness) {
      setCurrentIllnessId(currentIllness.id);
    }
  }, [currentIllness]);

  const saveIllness = () => {
    const symptoms = illnessForm.symptoms.map((symptom) => {
      if (symptom === "その他") {
        return {
          type: illnessForm.otherSymptom || "その他",
          id: Date.now() + Math.random(),
          recordedAt: new Date().toISOString(),
          recovered: false,
          recoveryDate: null,
        };
      }
      return {
        type: symptom,
        id: Date.now() + Math.random(),
        recordedAt: new Date().toISOString(),
        recovered: false,
        recoveryDate: null,
      };
    });

    console.log(illnessForm);

    const illnessInfo = {
      child_id: childStore.selectedChildId,
      name: illnessForm.name,
      start_date: illnessForm.start_date,
      notes: illnessForm.notes,
      symptoms: symptoms,
      otherSymptom: illnessForm.otherSymptom,
      // symptomDescriptions: illnessForm.symptomDescriptions
    };

    if (!editingIllness) {
      healthStore.addIllness(illnessInfo);
    } else {
      console.log(currentIllnessId, "currentIllnessId: ");
      healthStore.updateIllness(currentIllnessId, illnessInfo);
    }

    setShowNewIllnessForm(false);
    setEditingIllness(false);
    setIllnessForm({
      name: "",
      start_date: new Date(),
      notes: "",
      symptoms: [],
      otherSymptom: "",
      symptomDescriptions: {},
    });
  };

  const toggleSymptomRecovery = (illness, symptom) => {
    console.log(illness, symptom, "illness, symptom");
    const recovered = !symptom.recovered;
    const recoveryDate = recovered ? new Date().toISOString() : null;

    const updatedSymptoms = illness.symptoms.map((s) =>
      s.id === symptom.id ? { ...s, recovered, recoveryDate } : s
    );

    // すべての症状が完治しているかチェック
    const allRecovered = updatedSymptoms.every((s) => s.recovered);

    healthStore.updateIllness(illness.id, {
      ...illness,
      symptoms: updatedSymptoms,
      // すべての症状が完治している場合、病気全体も完治とする
      status: allRecovered ? "recovered" : "active",
      endDate: allRecovered ? new Date().toISOString() : null,
    });
  };

  const markAsRecovered = (illness) => {
    healthStore.updateIllness(illness.id, {
      ...illness,
      status: "recovered",
      endDate: new Date().toISOString(),
    });
  };

  const deleteIllness = (id) => {
    if (confirm("この病気記録を削除してもよろしいですか？")) {
      healthStore.deleteIllness(id);
      setExpandedIllness(null);
    }
  };

  const saveVisit = (visitData) => {
    console.log(visitData, currentIllness, "visitData");

    if (editingVisit) {
      const updatedVisits = currentIllness.hospitalVisits.map((visit) =>
        visit.id === editingVisit.id ? { ...visit, ...visitData } : visit
      );
      healthStore.updateIllness(currentIllness.id, {
        ...currentIllness,
        hospitalVisits: updatedVisits,
      });
      setEditingVisit(null);
    } else {
      healthStore.updateIllness(currentIllness.id, {
        ...currentIllness,
        hospitalVisits: [
          {
            id: Date.now(),
            ...visitData,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
    setShowNewVisitForm(false);
  };
  const editVisit = (visit) => {
    setEditingVisit(visit);
    setShowNewVisitForm(true);
  };

  const saveMedication = (medicationData) => {
    if (editingMedication) {
      const updatedMedications = currentIllness.medications.map((medication) =>
        medication.id === editingMedication.id
          ? { ...medication, ...medicationData }
          : medication
      );
      healthStore.updateIllness(currentIllness.id, {
        ...currentIllness,
        medications: updatedMedications,
      });
      setEditingMedication(null);
    } else {
      healthStore.updateIllness(currentIllness.id, {
        ...currentIllness,
        medications: [
          ...currentIllness.medications,
          {
            id: Date.now(),
            ...medicationData,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
    setShowNewMedicationForm(false);
  };
  const editMedication = (medication) => {
    setEditingMedication(medication);
    setShowNewMedicationForm(true);
  };

  const saveSymptom = (symptomData) => {
    healthStore.updateIllness(currentIllness.id, {
      ...currentIllness,
      symptoms: [
        ...currentIllness.symptoms,
        {
          id: Date.now(),
          ...symptomData,
          type:
            symptomData.type === "その他"
              ? symptomData.otherSymptom
              : symptomData.type,
          recordedAt: new Date().toISOString(),
          recovered: false,
          recoveryDate: null,
        },
      ],
    });
    setShowNewSymptomForm(false);
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
            病気記録
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24">
        {/* フィルター */}
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <div>
            <span className="block text-sm text-gray-600 mb-1">ステータス</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-1 pl-2 pr-8"
            >
              <option value="all">すべて</option>
              <option value="active">治療中</option>
              <option value="recovered">完治</option>
            </select>
          </div>

          <div>
            <span className="block text-sm text-gray-600 mb-1">期間</span>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="input py-1 pl-2 pr-8"
            >
              <option value="all">すべて</option>
              {/* TODO: 期間オプションの生成 */}
            </select>
          </div>
        </div>

        {/* 病気記録一覧 */}
        {/* 新規病気記録ボタン */}
        <button
          onClick={() => setShowNewIllnessForm(true)}
          className="w-full btn bg-white text-primary-600 border-2 border-primary-200 
                         hover:bg-primary-50 hover:border-primary-300 hover:scale-[1.02]
                         transition-all duration-300 group flex items-center justify-center mb-6"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新しい病気を記録
        </button>

        <div className="space-y-4 mt-6">
          {illnesses.map((illness) => (
            <IllnessCard
              key={illness.id}
              illness={illness}
              onClick={setExpandedIllness}
            />
          ))}
        </div>

        {/* 新規病気記録フォーム */}
        {showNewIllnessForm && (
          <IllnessForm
            illnessForm={illnessForm}
            setIllnessForm={setIllnessForm}
            onSave={saveIllness}
            onCancel={() => {
              setShowNewIllnessForm(false),
                setIllnessForm({
                  name: "",
                  start_date: new Date(),
                  notes: "",
                  symptoms: [],
                  otherSymptom: "",
                  symptomDescriptions: {},
                });
            }}
            availableSymptoms={availableSymptoms}
          />
        )}

        {/* 病気詳細モーダル */}
        {currentIllness && (
          <IllnessDetail
            illness={currentIllness}
            onClose={() => setExpandedIllness(null)}
            onEdit={() => {
              setIllnessForm({
                name: currentIllness.name,
                start_date: currentIllness.start_date,
                notes: currentIllness.notes,
                symptoms: currentIllness.symptoms.map((s) => s.type),
                otherSymptom: "",
                symptomDescriptions: {},
              });
              setEditingIllness(true);
              setShowNewIllnessForm(true);
              setExpandedIllness(null);
            }}
            onDelete={deleteIllness}
            onToggleSymptomRecovery={toggleSymptomRecovery}
            onMarkAsRecovered={markAsRecovered}
            onAddSymptom={() => setShowNewSymptomForm(true)}
            onAddVisit={() => setShowNewVisitForm(true)}
            onAddMedication={() => setShowNewMedicationForm(true)}
            onEditVisit={editVisit}
            onEditMedication={editMedication}
          />
        )}

        {/* 症状追加フォーム */}
        {showNewSymptomForm && (
          <SymptomForm
            onSave={saveSymptom}
            onCancel={() => setShowNewSymptomForm(false)}
            availableSymptoms={availableSymptoms}
          />
        )}

        {/* 受診記録フォーム */}
        {showNewVisitForm && (
          <VisitForm
            initialData={editingVisit}
            onSave={saveVisit}
            onCancel={() => setShowNewVisitForm(false)}
          />
        )}

        {/* 服薬記録フォーム */}
        {showNewMedicationForm && (
          <MedicationForm
            initialData={editingMedication}
            onSave={saveMedication}
            onCancel={() => setShowNewMedicationForm(false)}
          />
        )}
      </main>
    </div>
  );
};

export default IllnessManagement;
