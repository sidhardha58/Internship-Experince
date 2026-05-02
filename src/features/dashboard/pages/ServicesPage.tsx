import { useState, useEffect } from "react";
import ServiceTabs from "../components/services/ServiceTabs";
import ServiceList from "../components/services/ServiceList";
import ServiceConfig from "../components/services/ServiceConfig";
import MenuCatalog from "../components/services/MenuCatalog";

import WorkingHours from "../components/services/availability/WorkingHours";
import EmergencyStop from "../components/services/availability/EmergencyStop";
import LeaveManagement from "../components/services/availability/LeaveManagement";

import { getMenuCategories } from "../api/menuCategoryApi"; // ✅ adjust path if needed

type Service = {
  id: string;
  name: string;
  items: number;
  active: boolean;
};

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("management");
  const [availabilityTab, setAvailabilityTab] = useState("hours");

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  /* =========================
     FETCH MENU CATEGORIES (REAL DATA)
  ========================= */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getMenuCategories();

        console.log("🔥 API RESPONSE", res);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted: Service[] = res.data.map((cat: any) => ({
          id: cat._id, // ✅ REAL MongoDB ID
          name: cat.name,
          items: cat.items?.length || 0,
          active: true, // you can improve later
        }));

        setServices(formatted);

        // ✅ auto select first service
        if (formatted.length > 0) {
          setSelectedService(formatted[0]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch services", err);
      }
    };

    fetchServices();
  }, []);

  /* =========================
     TOGGLE ACTIVE
  ========================= */
  const toggleActive = () => {
    if (!selectedService) return;

    setSelectedService((prev) =>
      prev ? { ...prev, active: !prev.active } : prev,
    );
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (!selectedService) {
    return <div className="p-6">Loading services...</div>;
  }

  return (
    <div className="p-6 space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-gray-500">
          Configure your service offerings and availability
        </p>
      </div>

      {/* TABS */}
      <div className="flex bg-gray-100 rounded-xl w-fit p-1">
        <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* ===================== */}
      {/* SERVICE MANAGEMENT */}
      {/* ===================== */}
      {activeTab === "management" && (
        <div className="space-y-4">
          {/* SERVICE LIST */}
          <ServiceList
            services={services}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />

          {/* HEADER */}
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedService.name} Settings
            </h2>

            {/* TOGGLE */}
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  selectedService.active ? "text-green-600" : "text-gray-400"
                }`}
              >
                {selectedService.active ? "Active" : "Inactive"}
              </span>

              <button
                onClick={toggleActive}
                className={`relative w-11 h-6 rounded-full transition ${
                  selectedService.active ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
                    selectedService.active ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* MAIN CARD */}
          <div
            className={`bg-white border rounded-2xl p-4 shadow-sm ${
              !selectedService.active ? "opacity-60" : ""
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-x">
              <div className="pr-4">
                <ServiceConfig selectedService={selectedService} />
              </div>

              <div className="pl-4">
                {/* ✅ PASS REAL CATEGORY ID */}
                <MenuCatalog selectedService={selectedService} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== */}
      {/* AVAILABILITY */}
      {/* ===================== */}
      {activeTab === "availability" && (
        <div className="space-y-6">
          <div className="flex gap-6 border-b">
            <button
              onClick={() => setAvailabilityTab("hours")}
              className={`pb-3 ${
                availabilityTab === "hours"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Working Hours
            </button>

            <button
              onClick={() => setAvailabilityTab("leave")}
              className={`pb-3 ${
                availabilityTab === "leave"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Leave Management
            </button>
          </div>

          {availabilityTab === "hours" && <WorkingHours />}

          {availabilityTab === "leave" && (
            <>
              <EmergencyStop />
              <LeaveManagement />
            </>
          )}
        </div>
      )}
    </div>
  );
}
