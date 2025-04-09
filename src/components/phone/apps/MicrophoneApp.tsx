
import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MicrophoneApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<{id: number, duration: number, audioUrl: string}[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Inicializar contexto de audio
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      // Detener cualquier grabación en curso al desmontar
      if (isRecording) {
        stopRecording();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Temporizador para grabación
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setAudioLevel(0);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  // Efecto para análisis de audio durante la grabación
  useEffect(() => {
    let animationFrame: number;
    
    const analyzeAudio = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calcular nivel promedio de audio
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(Math.min(average * 1.5, 100)); // Escalar para mejor visualización
        
        animationFrame = requestAnimationFrame(analyzeAudio);
      }
    };
    
    if (isRecording && analyserRef.current) {
      animationFrame = requestAnimationFrame(analyzeAudio);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configurar analizador de audio
      if (audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordings(prev => [
          ...prev, 
          { id: Date.now(), duration: recordingTime, audioUrl }
        ]);
        
        setRecordingTime(0);
        
        // Detener todos los tracks del stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const playRecording = (id: number, audioUrl: string) => {
    if (currentlyPlaying !== null) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      if (currentlyPlaying === id) {
        setCurrentlyPlaying(null);
        return;
      }
    }
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setCurrentlyPlaying(id);
    }
  };
  
  const deleteRecording = (id: number) => {
    if (currentlyPlaying === id && audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
    
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Manejar fin de reproducción
  useEffect(() => {
    const handleEnded = () => {
      setCurrentlyPlaying(null);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);
  
  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Grabadora de Voz</h2>
      
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center mb-8">
          {isRecording ? (
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{formatTime(recordingTime)}</div>
              <div className="text-red-500 animate-pulse">Grabando...</div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-3xl font-bold mb-2">00:00</div>
              <div>Listo</div>
            </div>
          )}
        </div>
        
        {isRecording && (
          <div className="w-full max-w-md mb-8">
            <Progress value={audioLevel} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span>Nivel de Audio</span>
              <span>100</span>
            </div>
          </div>
        )}
        
        <div className="flex space-x-6">
          <Button
            className={`rounded-full h-16 w-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={toggleRecording}
          >
            {isRecording ? <Square size={24} /> : <Mic size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Reproductor de audio oculto */}
      <audio ref={audioRef} className="hidden" />
      
      {recordings.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Grabaciones</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recordings.map(recording => (
              <div 
                key={recording.id} 
                className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div>Grabación {new Date(recording.id).toLocaleTimeString()}</div>
                  <div className="text-sm text-gray-500">{formatTime(recording.duration)}</div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => playRecording(recording.id, recording.audioUrl)}
                  >
                    <Play size={16} className={currentlyPlaying === recording.id ? "text-blue-500" : ""} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteRecording(recording.id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MicrophoneApp;
