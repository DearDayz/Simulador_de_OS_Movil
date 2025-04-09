import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhone } from "@/context/PhoneContext";

const WebViewApp: React.FC = () => {
  const { currentApp, goBack } = usePhone();
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Determinar URL basada en la aplicación actual
  useEffect(() => {
    let targetUrl = "";
    switch (currentApp) {
      case "amazon":
        targetUrl = "https://www.mercadolibre.com.ve";
        break;
      case "tiktok":
        targetUrl = "https://www.cinesunidos.com";
        break;
      case "banco":
        targetUrl = "https://www.monitordolarvenezuela.com";
        break;
      case "slither":
        targetUrl = "http://slither.io";
        break;
      case "ujap":
        targetUrl = "https://ujap.edu.ve";
        break;
      default:
        targetUrl = "https://www.Baidu.com";
    }
    setUrl(targetUrl);
  }, [currentApp]);

  // Simular carga
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const loadTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadTimeout);
  }, [url]);

  const refreshPage = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const getPageTitle = () => {
    if (url.includes("amazon")) return "Amazon";
    if (url.includes("tiktok")) return "TikTok";
    if (url.includes("mercantilbanco")) return "Banco Mercantil";
    if (url.includes("slither")) return "Slither.io";
    if (url.includes("ujap")) return "UJAP";
    return "Navegador";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-2 border-b flex items-center">
        <Button variant="ghost" size="sm" className="p-1" onClick={goBack}>
          <X size={18} />
        </Button>

        <div className="flex-1 mx-2 bg-white border rounded-full px-3 py-1 text-sm truncate">
          {url}
        </div>

        <Button variant="ghost" size="sm" className="p-1" onClick={refreshPage}>
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden bg-white">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500">Cargando {getPageTitle()}...</div>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="text-red-500 text-lg mb-2">Error de conexión</div>
            <p className="text-gray-500 text-center mb-4">{error}</p>
            <Button onClick={refreshPage}>Reintentar</Button>
          </div>
        ) : (
          <iframe
            src={url}
            className="w-full h-full border-none"
            title={getPageTitle()}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
            onError={() => setError("No se pudo cargar la página")}
          />
        )}
      </div>

      <div className="bg-gray-100 p-2 border-t flex justify-between">
        <Button variant="ghost" size="sm" className="p-1" disabled>
          <ArrowLeft size={18} />
        </Button>

        <div className="text-xs text-gray-500">{getPageTitle()}</div>

        <Button variant="ghost" size="sm" className="p-1" disabled>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default WebViewApp;
