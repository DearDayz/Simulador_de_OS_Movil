
import React from "react";
import { X } from "lucide-react";
import { usePhone } from "@/context/PhoneContext";

// Nueva paleta para fondo blanco puro y texto negro
const COLORS = {
  fondo: "#fff",
  encabezado: "#fff",
  borde: "#111"
};

const SystemInfoScreen: React.FC = () => {
  const {
    isWifiConnected,
    isCellularConnected,
    cellularStrength,
    batteryLevel,
    isCharging,
    goBack,
  } = usePhone();

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: COLORS.fondo,
        color: "#111",
      }}
    >
      {/* Barra superior */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: COLORS.encabezado, color: "#111", borderBottom: `1px solid ${COLORS.borde}` }}
      >
        <span className="font-bold text-lg">Información del sistema</span>
        <button
          className="p-1 rounded-full hover:bg-black/10 transition"
          onClick={goBack}
          aria-label="Cerrar"
        >
          <X className="text-black" size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* General */}
        <section className="mb-5">
          <h3 className="font-bold text-base mb-2 text-black">Información general</h3>
          <ul className="text-sm space-y-1 text-black">
            <li>Fecha: <span className="font-medium">{currentDate}</span></li>
            <li>Hora: <span className="font-medium">{currentTime}</span></li>
            <li>Operador: <span className="font-medium">{isCellularConnected ? "Movistar" : "Sin señal"}</span></li>
            <li>Modelo: <span className="font-medium">DOS Phone 2024</span></li>
          </ul>
        </section>

        {/* Especificaciones */}
        <section className="mb-5">
          <h3 className="font-bold text-base mb-2 text-black">Especificaciones técnicas</h3>
          <ul className="text-sm space-y-1 text-black">
            <li>Sistema Operativo: <span className="font-medium">DOS 2.0</span></li>
            <li>Arquitectura: <span className="font-medium">64 bits</span></li>
            <li>Memoria RAM: <span className="font-medium">8GB</span></li>
            <li>Almacenamiento: <span className="font-medium">256GB</span></li>
            <li>Procesador: <span className="font-medium">Octa-core 2.8GHz</span></li>
          </ul>
        </section>

        {/* Estado del sistema */}
        <section className="mb-5">
          <h3 className="font-bold text-base mb-2 text-black">Estado del sistema</h3>
          <ul className="text-sm space-y-1 text-black">
            <li>WiFi: <span className={isWifiConnected ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>
              {isWifiConnected ? "Conectado" : "Desconectado"}
            </span></li>
            <li>Señal móvil: <span className={isCellularConnected ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>
              {isCellularConnected ? `Conectado (${cellularStrength}G)` : "Sin señal"}
            </span></li>
            <li>Batería: <span className="font-medium">{Math.round(batteryLevel)}%</span> {isCharging && <span className="text-green-700">(Cargando)</span>}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SystemInfoScreen;
