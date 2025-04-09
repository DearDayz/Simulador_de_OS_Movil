import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  User,
  Send,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const MessagesApp: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Novia que no tengo",
      lastMessage: "Hola, ¿cómo estás?",
      time: "10:30",
      unread: 2,
      messages: [
        { id: 1, text: "Hola, ¿cómo estás?", time: "10:28", isMe: false },
        { id: 2, text: "¿Nos vemos mañana?", time: "10:30", isMe: false },
      ],
    },
    {
      id: 2,
      name: "Prof Mayerlin",
      lastMessage: "Gracias",
      time: "Ayer",
      unread: 0,
      messages: [
        {
          id: 1,
          text: "Sabes que eres mi mejor alumno",
          time: "Ayer, 15:45",
          isMe: true,
        },
        { id: 2, text: "Sí, profe ya se", time: "Ayer, 16:30", isMe: false },
        {
          id: 3,
          text: "Gracias",
          time: "Ayer, 16:35",
          isMe: false,
        },
      ],
    },
    {
      id: 3,
      name: "Maduro",
      lastMessage: "Si",
      time: "Lun",
      unread: 0,
      messages: [
        {
          id: 1,
          text: "Te llego el bono camarada",
          time: "Lun, 09:15",
          isMe: false,
        },
        { id: 2, text: "Si", time: "Lun, 10:20", isMe: true },
      ],
    },
    {
      id: 4,
      name: "Grupo Familiar",
      lastMessage: "Papá: ¿A qué hora llegamos?",
      time: "Dom",
      unread: 0,
      messages: [
        {
          id: 1,
          text: "Mamá: Recuerden traer bebidas",
          time: "Dom, 11:15",
          isMe: false,
        },
        { id: 2, text: "Yo me encargo", time: "Dom, 11:20", isMe: true },
        {
          id: 3,
          text: "Papá: ¿A qué hora llegamos?",
          time: "Dom, 12:00",
          isMe: false,
        },
      ],
    },
  ]);

  const [activeConversation, setActiveConversation] = useState<number | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getConversation = (id: number) => {
    return conversations.find((conv) => conv.id === id) || null;
  };

  const handleOpenConversation = (id: number) => {
    // Marcar como leído
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, unread: 0 } : conv))
    );

    setActiveConversation(id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessage: newMessage,
                time: "Ahora",
              }
            : conv
        )
      );

      setNewMessage("");
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation, conversations]);

  return (
    <div className="h-full flex flex-col">
      {activeConversation === null ? (
        <>
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Mensajes</h2>
          </div>

          <div className="flex-1 overflow-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenConversation(conversation.id)}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg mr-3">
                  {conversation.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{conversation.name}</div>
                    <div className="text-xs text-gray-500">
                      {conversation.time}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </div>
                </div>
                {conversation.unread > 0 && (
                  <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <Button className="w-full flex items-center justify-center">
              <MessageSquare size={16} className="mr-1" />
              Nuevo Mensaje
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-gray-100 p-3 border-b flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 mr-2"
              onClick={() => setActiveConversation(null)}
            >
              <ArrowLeft size={20} />
            </Button>

            <div className="flex items-center flex-1">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
                {getConversation(activeConversation)?.name.charAt(0)}
              </div>
              <div className="font-medium">
                {getConversation(activeConversation)?.name}
              </div>
            </div>

            <Button variant="ghost" size="sm" className="p-1">
              <MoreVertical size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {getConversation(activeConversation)?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    <div>{message.text}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.isMe ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-3 border-t bg-white flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border rounded-full bg-gray-100"
              placeholder="Mensaje"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              size="sm"
              className="ml-2 rounded-full w-10 h-10 p-0"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesApp;
