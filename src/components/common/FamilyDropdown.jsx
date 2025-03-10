import React, { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  Users as UsersIcon,
} from "lucide-react";
import { useChildStore } from "../../stores/useChildStore";
import { useFamilyStore } from "../../stores/useFamilyStore";
import FamilyGroupModal from "./FamilyGroupModal";

const FamilyDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFamilyGroupModal, setShowFamilyGroupModal] = useState(false);
  const dropdownRef = useRef(null);
  const { children, selectedChildId, fetchChildren } = useChildStore();
  const { families, selectedFamilyId, fetchFamilies } = useFamilyStore();
  const childStore = useChildStore();
  const [selectedChild, setSelectedChild] = useState();
  // const [childrenList, setChildrenList] = useState(children);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const currentChild = children.find((child) => child.id === selectedChildId);
    // setChildrenList(fetchChildren(selectedFamilyId));
    setSelectedChild(currentChild);
    childStore.fetchDevelopmentInfo(selectedChildId);
  }, [selectedChildId]);

  const selectChild = (child) => {
    childStore.setCurrentChildInfo(child.id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-50 family-dropdown"
      >
        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
          {selectedChild && selectedChild.imageurl ? (
            <img
              src={selectedChild.imageurl}
              alt={selectedChild.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserIcon className="w-4 h-4 text-primary-500" />
          )}
        </div>
        <span className="font-medium">
          {selectedChild?.name || "子供を選択"}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          <button
            onClick={() => {
              setShowFamilyGroupModal(true);
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-2 flex items-center space-x-2 text-primary-600 hover:bg-gray-50 border-b border-gray-100"
          >
            <UsersIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">家族グループ切替</span>
          </button>

          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => selectChild(child)}
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                {child.imageurl ? (
                  <img
                    src={child.imageurl}
                    alt={child.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-primary-500" />
                )}
              </div>
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      )}

      {showFamilyGroupModal && (
        <FamilyGroupModal onClose={() => setShowFamilyGroupModal(false)} />
      )}
    </div>
  );
};

export default FamilyDropdown;
