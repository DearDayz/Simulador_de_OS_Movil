import React, { useState, useEffect } from "react";
import { usePhone } from "@/context/PhoneContext";
import { Phone, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PhoneApp: React.FC = () => {
  const {
    simulateCall,
    endCall,
    isInCall,
    currentCallNumber,
    currentCallName,
  } = usePhone();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Manejar temporizador para la duración de la llamada
  useEffect(() => {
    let timer: number | undefined;

    if (isInCall) {
      timer = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCall]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNumberClick = (num: string) => {
    if (!isInCall) {
      setPhoneNumber((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      simulateCall(phoneNumber, "");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Call screen
  if (isInCall) {
    return (
      <div className="h-full flex flex-col justify-between bg-gradient-to-b from-blue-500 to-blue-700 p-6 animate-fade-in">
        <div className="flex flex-col items-center mt-12">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-500 text-4xl mb-4">
            {currentCallName
              ? currentCallName[0].toUpperCase()
              : currentCallNumber?.[0]?.toUpperCase() || "?"}
          </div>
          <h2 className="text-white text-2xl font-semibold">
            {currentCallName || currentCallNumber}
          </h2>
          <p className="text-blue-200 mt-2">Llamada en curso...</p>
          <p className="text-white mt-1 font-mono">
            {formatCallDuration(callDuration)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-16">
          <Button
            variant="outline"
            className={`rounded-full h-16 w-16 mx-auto ${
              isMuted
                ? "bg-red-500 text-white border-red-500"
                : "bg-white/20 text-white border-white/30"
            }`}
            onClick={toggleMute}
          >
            <Mic size={24} />
          </Button>
          <Button
            variant="outline"
            className="rounded-full h-16 w-16 mx-auto bg-red-500 text-white border-red-500"
            onClick={endCall}
          >
            <X size={28} />
          </Button>
          <div className="h-16 w-16"></div> {/* Empty space for alignment */}
        </div>
      </div>
    );
  }

  // Dialer screen
  return (
    <div className="h-full flex flex-col p-6">
      <div className="text-center my-4">
        <input
          type="text"
          className="text-3xl font-semibold text-center w-full bg-transparent focus:outline-none"
          value={phoneNumber}
          readOnly
          placeholder="Ingresa número"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-16 text-2xl rounded-full hover:bg-gray-100"
            onClick={() => handleNumberClick(num.toString())}
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600"
          onClick={handleCall}
          disabled={phoneNumber.length === 0}
        >
          <Phone size={24} />
        </Button>
      </div>

      {phoneNumber.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            className="text-red-500"
            onClick={handleBackspace}
          >
            Borrar
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhoneApp;
