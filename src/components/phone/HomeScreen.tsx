import React from "react";
import { usePhone } from "@/context/PhoneContext";
import AppIcon from "./AppIcon";
import {
  Phone,
  Camera,
  Mic,
  Battery,
  Wifi,
  HardDrive,
  Image,
  Gamepad2,
  Calculator,
  Calendar,
  User,
  MessageSquare,
  ShoppingCart,
  Ticket,
  Banknote,
  Joystick,
  University,
  Book
} from "lucide-react";

const HomeScreen: React.FC = () => {
  const { setCurrentApp } = usePhone();

  const apps = [
    { name: "Teléfono", icon: Phone, color: "bg-green-500", appId: "phone" },
    { name: "Cámara", icon: Camera, color: "bg-blue-500", appId: "camera" },
    { name: "Galería", icon: Image, color: "bg-purple-500", appId: "gallery" },
    { name: "Juego", icon: Gamepad2, color: "bg-orange-500", appId: "game" },
    {
      name: "Calculadora",
      icon: Calculator,
      color: "bg-red-500",
      appId: "calculator",
    },
    {
      name: "Micrófono",
      icon: Mic,
      color: "bg-indigo-500",
      appId: "microphone",
    },
    {
      name: "Batería",
      icon: Battery,
      color: "bg-yellow-500",
      appId: "battery",
    },
    {
      name: "Wi-Fi",
      icon: Wifi,
      color: "bg-purple-500",
      appId: "connectivity",
    },
    {
      name: "Almacenamiento",
      icon: HardDrive,
      color: "bg-red-500",
      appId: "memory",
    },
    {
      name: "Calendario",
      icon: Calendar,
      color: "bg-blue-400",
      appId: "calendar",
    },
    { name: "Contactos", icon: User, color: "bg-green-400", appId: "contacts" },
    {
      name: "Mensajes",
      icon: MessageSquare,
      color: "bg-blue-500",
      appId: "messages",
    },
    {
      name: "Mercado Libre",
      icon: ShoppingCart,
      color: "bg-yellow-600",
      appId: "amazon",
    },
    {
      name: "Cines Unidos",
      icon: Ticket,
      color: "bg-black",
      appId: "tiktok",
    },
    { name: "BCV", icon: Banknote, color: "bg-red-600", appId: "banco" },
    {
      name: "Slither.io",
      icon: Joystick,
      color: "bg-green-600",
      appId: "slither",
    },
    { name: "UJAP", icon: University, color: "bg-blue-600", appId: "ujap" },
    {
      name: "Manual",
      icon: Book,
      color: "bg-blue-500",
      appId: "manual"
    },
  ];

  return (
    <div
      className="h-full p-6 pt-12 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #4c669f, #3b5998, #192f6a)",
      }}
    >
      <div className="grid grid-cols-4 gap-x-4 gap-y-6">
        {apps.map((app) => (
          <AppIcon
            key={app.name}
            icon={app.icon}
            label={app.name}
            onClick={() => setCurrentApp(app.appId)}
            color={app.color}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
