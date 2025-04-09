
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppIconProps {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({ icon: Icon, label, color, onClick }) => {
  return (
    <button
      className="flex flex-col items-center gap-1 transition-transform active:scale-95"
      onClick={onClick}
    >
      <div 
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", 
          color
        )}
      >
        <Icon size={28} className="text-white" />
      </div>
      <span className="text-xs font-medium text-white">{label}</span>
    </button>
  );
};

export default AppIcon;
