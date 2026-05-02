type Service = {
  id: string;
  name: string;
  items: number;
  active: boolean;
};

type Props = {
  services: Service[];
  selectedService: Service;
  setSelectedService: (service: Service) => void;
};

export default function ServiceList({
  services,
  selectedService,
  setSelectedService,
}: Props) {
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex gap-3 bg-gray-100/60 px-3 py-2 rounded-2xl w-fit">
        {services.map((service) => {
          const isSelected = selectedService.id === service.id;

          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-m font-medium transition-all duration-200 whitespace-nowrap
                ${
                  isSelected
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-600 hover:bg-white/80 hover:text-gray-900 cursor-pointer"
                }`}
            >
              {/* NAME */}
              <span className="font-semibold tracking-tight">
                {service.name}
              </span>

              {/* ITEMS COUNT */}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md
                  ${
                    isSelected
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {service.items}
              </span>

              {/* STATUS */}
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide
                  ${
                    service.active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {service.active ? "Active" : "Paused"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
