import React, { useState } from "react";
import { User, Phone, Plus, Search, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhone } from "@/context/PhoneContext";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

const ContactsApp: React.FC = () => {
  const { simulateCall } = usePhone();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Mama", phone: "555-1234", email: "Mama@gmail.com" },
    { id: 2, name: "Papa", phone: "555-5678", email: "Papa@gmail.com" },
    { id: 3, name: "El que vende a bcv", phone: "555-9012" },
    {
      id: 4,
      name: "Diosdado",
      phone: "555-3456",
      email: "ChavezVive@gmail.com",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
  });
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      const contact: Contact = {
        id: Date.now(),
        ...newContact,
      };

      setContacts([...contacts, contact]);
      setNewContact({ name: "", phone: "" });
      setShowAddContact(false);
    }
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    if (activeContact && activeContact.id === id) {
      setActiveContact(null);
    }
  };

  const callContact = (phone: string, name: string) => {
    simulateCall(phone, name);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (id: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="h-full flex flex-col">
      {!activeContact ? (
        <>
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Contactos
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border rounded-md"
                placeholder="Buscar contactos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No se encontraron contactos</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setActiveContact(contact)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${getRandomColor(
                        contact.id
                      )} text-white flex items-center justify-center mr-3`}
                    >
                      {getInitials(contact.name)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-500">
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <Button
              className="w-full flex items-center justify-center"
              onClick={() => setShowAddContact(true)}
            >
              <Plus size={16} className="mr-1" />
              Nuevo Contacto
            </Button>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setActiveContact(null)}
            >
              <X size={20} />
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 p-2"
              onClick={() => deleteContact(activeContact.id)}
            >
              Eliminar
            </Button>
          </div>

          <div className="flex-1 p-4">
            <div className="flex flex-col items-center mb-6">
              <div
                className={`w-24 h-24 rounded-full ${getRandomColor(
                  activeContact.id
                )} text-white flex items-center justify-center text-3xl`}
              >
                {getInitials(activeContact.name)}
              </div>
              <h2 className="text-2xl font-semibold mt-2">
                {activeContact.name}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center">
                  <Phone size={20} className="text-gray-500 mr-2" />
                  <div>
                    <div className="font-medium">{activeContact.phone}</div>
                    <div className="text-xs text-gray-500">Móvil</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() =>
                    callContact(activeContact.phone, activeContact.name)
                  }
                >
                  <Phone size={16} />
                </Button>
              </div>

              {activeContact.email && (
                <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                  <Mail size={20} className="text-gray-500 mr-2" />
                  <div>
                    <div className="font-medium">{activeContact.email}</div>
                    <div className="text-xs text-gray-500">Email</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddContact && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-4">Nuevo Contacto</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Nombre del contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="Número de teléfono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={newContact.email || ""}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      email: e.target.value || undefined,
                    })
                  }
                  placeholder="Email del contacto"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddContact(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={addContact}>Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsApp;
