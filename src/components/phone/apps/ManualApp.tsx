
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ManualApp = () => {
  return (
    <div className="h-full bg-white p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Manual de Usuario</h1>
      
      <Accordion type="single" collapsible>
        <AccordionItem value="phone">
          <AccordionTrigger>Teléfono</AccordionTrigger>
          <AccordionContent>
            La aplicación de teléfono permite realizar llamadas simuladas. 
            Características:
            - Teclado numérico para marcar números
            - Lista de llamadas recientes
            - Botón de llamada verde para iniciar llamada
            - Botón rojo para finalizar llamada
            - Durante la llamada: altavoz y silenciar micrófono
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="camera">
          <AccordionTrigger>Cámara</AccordionTrigger>
          <AccordionContent>
            Aplicación básica de cámara con las siguientes funciones:
            - Cámara frontal (selfie)
            - Botón de captura en el centro
            - Botón para cambiar cámara (simulado)
            - Las fotos se guardan automáticamente en la galería
            Nota: No incluye flash ni efectos especiales
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gallery">
          <AccordionTrigger>Galería</AccordionTrigger>
          <AccordionContent>
            Visualizador de fotos con las siguientes características:
            - Vista en cuadrícula de todas las fotos
            - Posibilidad de eliminar fotos
            - Vista previa a pantalla completa
            - Integración directa con la app de cámara
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="calculator">
          <AccordionTrigger>Calculadora</AccordionTrigger>
          <AccordionContent>
            Calculadora básica que incluye:
            - Operaciones básicas (suma, resta, multiplicación, división)
            - Teclas numéricas del 0-9
            - Botón de borrar (C)
            - Botón de igual (=)
            - Visualización del resultado en pantalla
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="microphone">
          <AccordionTrigger>Micrófono</AccordionTrigger>
          <AccordionContent>
            Grabadora de voz simple:
            - Botón para iniciar/detener grabación
            - Visualización del tiempo de grabación
            - Lista de grabaciones guardadas
            - Reproductor de grabaciones
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="battery">
          <AccordionTrigger>Batería</AccordionTrigger>
          <AccordionContent>
            Monitor de batería que muestra:
            - Porcentaje actual de batería
            - Estado de carga
            - Tiempo estimado restante
            - Gráfico de uso de batería
            - Lista de apps que más consumen
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="connectivity">
          <AccordionTrigger>Wi-Fi y Datos</AccordionTrigger>
          <AccordionContent>
            Control de conexiones con:
            - Interruptor para activar/desactivar WiFi
            - Interruptor para activar/desactivar datos móviles
            - Información de red actual
            - Estado de la señal
            - Estadísticas de uso de datos
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="memory">
          <AccordionTrigger>Almacenamiento</AccordionTrigger>
          <AccordionContent>
            Gestor de almacenamiento que muestra:
            - Espacio total y disponible
            - Uso de RAM
            - Lista de aplicaciones en ejecución
            - Opción para cerrar aplicaciones
            - Gráficos de uso de memoria
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="calendar">
          <AccordionTrigger>Calendario</AccordionTrigger>
          <AccordionContent>
            Calendario básico que permite:
            - Ver el mes actual
            - Navegar entre meses
            - Ver eventos del día
            - Vista de semana y mes
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contacts">
          <AccordionTrigger>Contactos</AccordionTrigger>
          <AccordionContent>
            Gestor de contactos con:
            - Lista de contactos almacenados
            - Búsqueda de contactos
            - Ver detalles de contacto
            - Llamar a contactos directamente
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="messages">
          <AccordionTrigger>Mensajes</AccordionTrigger>
          <AccordionContent>
            Aplicación de mensajería que incluye:
            - Lista de conversaciones
            - Vista de mensajes individuales
            - Campo para escribir mensajes
            - Indicador de estado de mensaje
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default ManualApp;
