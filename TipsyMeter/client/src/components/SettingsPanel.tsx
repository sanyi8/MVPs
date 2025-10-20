import { useState, useEffect } from "react";
import { X, Plus, Trash2, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDrinkForm from "./CustomDrinkForm";
import { Drink } from "@/types";

// Define setting types
export interface ContactInfo {
  id: string;
  name: string;
  phone: string;
}

export interface TaxiInfo {
  id: string;
  name: string;
  phone: string;
  appUrl: string;
}

export interface AppSettings {
  tipsyThreshold: number;
  drunkThreshold: number;
  contacts: ContactInfo[];
  taxis: TaxiInfo[];
}

const defaultSettings: AppSettings = {
  tipsyThreshold: 40,
  drunkThreshold: 60,
  contacts: [
    { id: "1", name: "Helping Contact", phone: "" }
  ],
  taxis: [
    { id: "1", name: "Local Taxi", phone: "", appUrl: "" },
    { id: "2", name: "Uber", phone: "", appUrl: "https://m.uber.com/" }
  ]
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings;
  onAddCustomDrink: (drink: Omit<Drink, "id" | "sessionId"> & { name: string, emoji?: string, bgColor?: string, alcoholPercentage: number }) => void;
}

export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  onSave,
  currentSettings = defaultSettings,
  onAddCustomDrink
}: SettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  const { toast } = useToast();
  
  // Update settings when props change
  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  // Add a new contact and auto-save
  const addContact = () => {
    const newContact: ContactInfo = {
      id: Date.now().toString(),
      name: "",
      phone: ""
    };
    
    const newSettings = {
      ...settings,
      contacts: [...settings.contacts, newContact]
    };
    
    setSettings(newSettings);
    onSave(newSettings);
  };
  
  // Remove a contact and auto-save
  const removeContact = (id: string) => {
    const newSettings = {
      ...settings,
      contacts: settings.contacts.filter(contact => contact.id !== id)
    };
    
    setSettings(newSettings);
    onSave(newSettings);
    
    toast({
      title: "Contact removed",
      duration: 1500
    });
  };
  
  // Update contact info and auto-save
  const updateContact = (id: string, field: keyof ContactInfo, value: string) => {
    const newSettings = {
      ...settings,
      contacts: settings.contacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    };
    
    setSettings(newSettings);
    onSave(newSettings);
  };
  
  // Add a new taxi service and auto-save
  const addTaxi = () => {
    const newTaxi: TaxiInfo = {
      id: Date.now().toString(),
      name: "",
      phone: "",
      appUrl: ""
    };
    
    const newSettings = {
      ...settings,
      taxis: [...settings.taxis, newTaxi]
    };
    
    setSettings(newSettings);
    onSave(newSettings);
  };
  
  // Remove a taxi service and auto-save
  const removeTaxi = (id: string) => {
    const newSettings = {
      ...settings,
      taxis: settings.taxis.filter(taxi => taxi.id !== id)
    };
    
    setSettings(newSettings);
    onSave(newSettings);
    
    toast({
      title: "Taxi service removed",
      duration: 1500
    });
  };
  
  // Update taxi info and auto-save
  const updateTaxi = (id: string, field: keyof TaxiInfo, value: string) => {
    const newSettings = {
      ...settings,
      taxis: settings.taxis.map(taxi => 
        taxi.id === id ? { ...taxi, [field]: value } : taxi
      )
    };
    
    setSettings(newSettings);
    onSave(newSettings);
  };
  
  // Update threshold values and auto-save, ensuring tipsy > drunk
  const updateThreshold = (field: "tipsyThreshold" | "drunkThreshold", value: number) => {
    // Create a copy of settings
    let newSettings = { ...settings };
    
    // Logic to ensure tipsy threshold is always lower than drunk threshold
    if (field === "tipsyThreshold") {
      // If tipsy is set higher than drunk, adjust drunk to be higher
      if (value >= settings.drunkThreshold) {
        newSettings = {
          ...newSettings,
          tipsyThreshold: value,
          drunkThreshold: value + 5 // Ensure drunk is higher by at least 5 points
        };
        
        toast({
          title: "Both thresholds updated",
          description: "Drunk threshold was automatically increased to maintain proper order.",
          duration: 2000
        });
      } else {
        newSettings = {
          ...newSettings,
          tipsyThreshold: value
        };
      }
    } else { // drunkThreshold
      // If drunk is set lower than tipsy, adjust tipsy to be lower
      if (value <= settings.tipsyThreshold) {
        newSettings = {
          ...newSettings,
          drunkThreshold: value,
          tipsyThreshold: value - 5 // Ensure tipsy is lower by at least 5 points
        };
        
        toast({
          title: "Both thresholds updated",
          description: "Tipsy threshold was automatically decreased to maintain proper order.",
          duration: 2000
        });
      } else {
        newSettings = {
          ...newSettings,
          drunkThreshold: value
        };
      }
    }
    
    setSettings(newSettings);
    onSave(newSettings);
    
    toast({
      title: "Settings updated",
      description: "Your threshold settings have been saved.",
      duration: 1500
    });
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close settings"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="custom-drink">Custom Drink</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="mt-4">
              <div className="space-y-6">
                {/* Tipsy Thresholds */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tipsy Level Thresholds</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="tipsy-threshold">Tipsy Threshold: {settings.tipsyThreshold} points</Label>
                    </div>
                    <Slider 
                      id="tipsy-threshold"
                      min={20} 
                      max={80} 
                      step={5}
                      value={[settings.tipsyThreshold]}
                      onValueChange={(value) => updateThreshold("tipsyThreshold", value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="drunk-threshold">Drunk Threshold: {settings.drunkThreshold} points</Label>
                    </div>
                    <Slider 
                      id="drunk-threshold"
                      min={40} 
                      max={100} 
                      step={5}
                      value={[settings.drunkThreshold]}
                      onValueChange={(value) => updateThreshold("drunkThreshold", value[0])}
                    />
                  </div>
                </div>
                
                {/* Helping Contacts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Helping Contacts</h3>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={addContact}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {settings.contacts.map((contact) => (
                    <div key={contact.id} className="space-y-2 p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`contact-name-${contact.id}`}>Name</Label>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeContact(contact.id)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        id={`contact-name-${contact.id}`}
                        value={contact.name}
                        placeholder="Friend, Family, Taxi or Uber"
                        onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                      />
                      
                      <Label htmlFor={`contact-phone-${contact.id}`}>Phone</Label>
                      <Input
                        id={`contact-phone-${contact.id}`}
                        value={contact.phone}
                        placeholder="+1234567890"
                        onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom-drink" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Custom Drink</h3>
                <p className="text-sm text-gray-500">
                  Create a custom drink with specific alcohol content and size. This will be added to your drinks list.
                </p>
                <CustomDrinkForm onAddCustomDrink={onAddCustomDrink} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <Button onClick={onClose}>
            Close Settings
          </Button>
        </div>
      </div>
    </div>
  );
}