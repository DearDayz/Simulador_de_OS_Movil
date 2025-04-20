
import React from "react";
import { Info } from "lucide-react";
import { usePhone } from "@/context/PhoneContext";

/*
Este componente ahora abre la app de información como cualquier app.
*/

const SystemInfo = () => {
  const { setCurrentApp } = usePhone();

  return (
    <div
      className="cursor-pointer"
      onClick={() => setCurrentApp("info")}
      title="Ver info del sistema"
    >
      <Info size={14} className="text-white" />
    </div>
  );
};

export default SystemInfo;
