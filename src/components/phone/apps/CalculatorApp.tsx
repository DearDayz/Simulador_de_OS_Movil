
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (op: string, first: number, second: number): number => {
    switch (op) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "×":
        return first * second;
      case "÷":
        return first / second;
      default:
        return second;
    }
  };

  const calculateResult = () => {
    if (firstOperand === null || operator === null) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = performCalculation(operator, firstOperand, inputValue);

    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const buttonStyle = "h-16 text-xl font-semibold rounded-full transition-transform active:scale-95";

  return (
    <div className="h-full flex flex-col bg-gray-900 p-4">
      <div className="flex-none h-24 flex items-end justify-end p-2">
        <div className="text-4xl text-white font-light overflow-hidden">
          {display}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 mt-6">
        {/* Row 1 */}
        <Button 
          className={`${buttonStyle} bg-gray-500 hover:bg-gray-600`}
          onClick={clearDisplay}
        >
          {firstOperand === null ? "AC" : "C"}
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-500 hover:bg-gray-600`}
          onClick={toggleSign}
        >
          +/-
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-500 hover:bg-gray-600`}
          onClick={inputPercent}
        >
          %
        </Button>
        <Button 
          className={`${buttonStyle} bg-amber-500 hover:bg-amber-600 text-white`}
          onClick={() => handleOperator("÷")}
        >
          ÷
        </Button>

        {/* Row 2 */}
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("7")}
        >
          7
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("8")}
        >
          8
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("9")}
        >
          9
        </Button>
        <Button 
          className={`${buttonStyle} bg-amber-500 hover:bg-amber-600 text-white`}
          onClick={() => handleOperator("×")}
        >
          ×
        </Button>

        {/* Row 3 */}
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("4")}
        >
          4
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("5")}
        >
          5
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("6")}
        >
          6
        </Button>
        <Button 
          className={`${buttonStyle} bg-amber-500 hover:bg-amber-600 text-white`}
          onClick={() => handleOperator("-")}
        >
          -
        </Button>

        {/* Row 4 */}
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("1")}
        >
          1
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("2")}
        >
          2
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={() => inputDigit("3")}
        >
          3
        </Button>
        <Button 
          className={`${buttonStyle} bg-amber-500 hover:bg-amber-600 text-white`}
          onClick={() => handleOperator("+")}
        >
          +
        </Button>

        {/* Row 5 */}
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white col-span-2`}
          onClick={() => inputDigit("0")}
        >
          0
        </Button>
        <Button 
          className={`${buttonStyle} bg-gray-700 hover:bg-gray-800 text-white`}
          onClick={inputDecimal}
        >
          .
        </Button>
        <Button 
          className={`${buttonStyle} bg-amber-500 hover:bg-amber-600 text-white`}
          onClick={calculateResult}
        >
          =
        </Button>
      </div>
    </div>
  );
};

export default CalculatorApp;
