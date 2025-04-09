import React from "react";
import PhoneFrame from "@/components/phone/PhoneFrame";
import { PhoneProvider } from "@/context/PhoneContext";
import { usePhone } from "@/context/PhoneContext";
import HomeScreen from "@/components/phone/HomeScreen";
import AppScreen from "@/components/phone/AppScreen";
//import PowerMenu from "@/components/phone/PowerMenu";
import ShutdownOverlay from "@/components/phone/ShutdownOverlay";

// This component renders either the HomeScreen or an app
const PhoneContent = () => {
  const { currentApp, isShutDown } = usePhone();

  if (isShutDown) {
    return null; // Don't render content when shut down
  }

  return currentApp ? <AppScreen /> : <HomeScreen />;
};

const PhoneInterface = () => {
  return (
    <>
      <PhoneContent />

      <ShutdownOverlay />
    </>
  );
};

const Index = () => {
  return (
    <PhoneProvider>
      <PhoneFrame>
        <PhoneInterface />
      </PhoneFrame>
    </PhoneProvider>
  );
};

export default Index;
