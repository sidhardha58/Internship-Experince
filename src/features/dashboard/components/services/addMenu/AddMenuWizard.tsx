/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type { MenuData } from "../../../../dashboard/types/menu.types";

import Step1MenuInfo from "./steps/Step1MenuInfo";
import Step2Sections from "./steps/Step2Sections";
import Step3Summary from "./steps/Step3Summary";

import MenuPreviewPanel from "./components/preview/MenuPreviewPanel";

import { useCreateMenuFlow } from "../../../hooks/useCreateMenuFlow";
import { useUpdateMenu } from "../../../hooks/useUpdateMenu";
import { useGetMenuById } from "../../../hooks/useGetMenuById";

export default function AddMenuWizard({
  onClose,
  menuCategoryId,
  editData,
}: {
  onClose: () => void;
  menuCategoryId: string;
  editData?: any;
}) {
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  const isEditMode = !!editData;

  /* =========================
     HOOKS
  ========================= */
  const { createFullMenu, loading: createLoading } = useCreateMenuFlow();
  const { updateFullMenu, loading: updateLoading } = useUpdateMenu();

  const { menu: fullMenu, loading: menuLoading } = useGetMenuById(
    editData?._id || null,
  );

  const isSaving = isEditMode ? updateLoading : createLoading;

  /* =========================
     INITIAL STATE
  ========================= */
  const getInitialState = (): MenuData => ({
    name: "",
    type: "veg",
    price: 0,
    minMembers: 0,
    maxMembers: 0,
    image: null,
    imagePreview: "",
    sections: [],
    menuCategoryId: menuCategoryId || "",
  });

  const [menuData, setMenuData] = useState<MenuData>(getInitialState());

  /* =========================
     SYNC CATEGORY
  ========================= */
  useEffect(() => {
    if (menuCategoryId) {
      setMenuData((prev) => ({
        ...prev,
        menuCategoryId,
      }));
    }
  }, [menuCategoryId]);

  /* =========================
     PREFILL EDIT DATA
  ========================= */
  useEffect(() => {
    if (!isEditMode || !fullMenu) return;

    setMenuData({
      name: fullMenu.name || "",
      type: fullMenu?.category_specific_data?.is_veg ? "veg" : "nonveg",

      // ✅ keep same unit as before (no pricing changes as requested)
      price: fullMenu.price || 0,

      minMembers: fullMenu?.category_specific_data?.min_people || 0,
      maxMembers: fullMenu?.category_specific_data?.max_people || 0,

      image: null,
      imagePreview: fullMenu?.image_url?.url || "",

      menuCategoryId:
        fullMenu?.category_specific_data?.menu_category || menuCategoryId,

      sections:
        fullMenu.food_categories?.map((section: any) => ({
          id: section._id,
          name: section.name,

          selectionType:
            section.selection_type === "custom-select" ? "limited" : "all",

          selection_amount: section.selection_amount || 0,

          items:
            section.menu_items?.map((item: any) => ({
              id: item._id,
              name: item.name,
              description: item.description || "",
              image: null,
              imagePreview: item.url || "",
            })) || [],
        })) || [],
    });
  }, [isEditMode, fullMenu, menuCategoryId]);

  /* =========================
     VALIDATION (IMAGE REQUIRED)
  ========================= */
  const hasMenuImage = Boolean(menuData.image || menuData.imagePreview);

  const sectionsValid =
    menuData.sections.length > 0 &&
    menuData.sections.every(
      (section) =>
        section.name.trim() !== "" &&
        section.items.length > 0 &&
        section.items.every(
          (item) =>
            item.name.trim() !== "" && (item.image || item.imagePreview), // ✅ image required
        ),
    );

  const isValid =
    menuData.name.trim() !== "" &&
    menuData.price > 0 &&
    menuData.minMembers > 0 &&
    menuData.maxMembers >= menuData.minMembers &&
    hasMenuImage &&
    sectionsValid;

  const canProceedStep1 =
    menuData.name.trim() !== "" &&
    menuData.price > 0 &&
    menuData.minMembers > 0 &&
    menuData.maxMembers >= menuData.minMembers &&
    hasMenuImage;

  const canProceedStep2 = sectionsValid;

  /* =========================
     NAVIGATION
  ========================= */
  const handleNext = () => {
    if (step === 1 && !canProceedStep1) return;
    if (step === 2 && !canProceedStep2) return;

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  /* =========================
     CLOSE
  ========================= */
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  /* =========================
     SAVE (CREATE / UPDATE)
  ========================= */
  const handleSave = async () => {
    if (!isValid) return;

    let res;

    if (isEditMode) {
      // ✅ correct usage
      res = await updateFullMenu(menuData, editData._id);
    } else {
      res = await createFullMenu(menuData);
    }

    if (res?.success) {
      handleClose();
    } else {
      console.error("❌ Save failed");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* DRAWER */}
      <div
        className={`w-[65%] h-full bg-white shadow-2xl flex ${
          isClosing ? "animate-slideOutRight" : "animate-slideInLeft"
        }`}
      >
        {/* LEFT PREVIEW */}
        <MenuPreviewPanel step={step} menuData={menuData} />

        {/* RIGHT PANEL */}
        <div className="w-[65%] flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <h2 className="text-lg font-semibold">
              {isEditMode ? "Edit Menu" : "Add New Menu"}
            </h2>

            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* STEPPER */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between">
              {["Menu Info", "Sections", "Summary"].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-xs rounded-full ${
                      step > i + 1
                        ? "bg-green-500 text-white"
                        : step === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {isEditMode && menuLoading ? (
              <div className="text-center text-gray-400">Loading menu...</div>
            ) : (
              <>
                {step === 1 && (
                  <Step1MenuInfo
                    menuData={menuData}
                    setMenuData={setMenuData}
                  />
                )}

                {step === 2 && (
                  <Step2Sections
                    menuData={menuData}
                    setMenuData={setMenuData}
                  />
                )}

                {step === 3 && <Step3Summary menuData={menuData} />}
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <button
              onClick={handleBack}
              disabled={step === 1 || isSaving}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  isSaving ||
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2)
                }
                className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!isValid || isSaving}
                className="px-5 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300"
              >
                {isSaving
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update Menu"
                    : "Save Menu"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
