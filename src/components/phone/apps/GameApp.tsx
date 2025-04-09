
import React, { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GameApp: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [buttonColor, setButtonColor] = useState("#3498db");
  
  const colors = [
    "#3498db", // azul
    "#2ecc71", // verde
    "#e74c3c", // rojo
    "#f39c12", // naranja
    "#9b59b6", // morado
    "#1abc9c", // turquesa
    "#d35400", // calabaza
    "#8e44ad"  // violeta
  ];
  
  const addPoint = () => {
    // Incrementar puntuación
    const newScore = score + 1;
    setScore(newScore);
    
    // Actualizar puntuación máxima si es necesario
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('pocketPhoneGameHighScore', newScore.toString());
    }
    
    // Cambiar color del botón
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setButtonColor(randomColor);
  };
  
  const resetGame = () => {
    setScore(0);
    setButtonColor("#3498db");
  };
  
  // Cargar puntuación máxima desde localStorage al iniciar
  React.useEffect(() => {
    const savedHighScore = localStorage.getItem('pocketPhoneGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);
  
  return (
    <div className="h-full flex flex-col p-4 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-4">Clic de Colores</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold">Puntos: {score}</div>
        <div className="text-sm">Mejor Puntuación: {highScore}</div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div 
          className="w-48 h-48 rounded-full mb-8 flex items-center justify-center text-white font-bold text-2xl"
          style={{ backgroundColor: buttonColor }}
        >
          {score}
        </div>
        
        <Button 
          className="w-64 h-16 text-lg transition-transform active:scale-95"
          style={{ backgroundColor: buttonColor }}
          onClick={addPoint}
        >
          ¡PULSA AQUÍ!
        </Button>
        
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={resetGame}
        >
          Reiniciar Juego
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>¡Pulsa el botón para ganar puntos y cambiar colores!</p>
        <div className="flex items-center justify-center mt-2">
          <Gamepad2 size={16} className="mr-1 opacity-50" />
          <span>Clic de Colores v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default GameApp;
