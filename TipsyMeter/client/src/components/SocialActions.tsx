import { useState } from "react";
import { Share2, PhoneCall, Car, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/hooks/use-settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SocialActionsProps {
  tipsyPoints: number;
  showShareOptions: boolean;
}

export default function SocialActions({ tipsyPoints, showShareOptions }: SocialActionsProps) {
  const { toast } = useToast();
  const { settings } = useSettings();
  const [friendsExpanded, setFriendsExpanded] = useState(false);
  const [taxisExpanded, setTaxisExpanded] = useState(false);
  
  const handleShareFacebook = () => {
    // Generate sharing message based on tipsy level
    const message = encodeURIComponent(
      `I'm using the TipsyCalculator app! My current tipsy level is at ${tipsyPoints} points.`
    );
    
    // Open Facebook share dialog
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${message}`,
      '_blank',
      'width=600,height=400'
    );
    
    toast({
      title: "Sharing to Facebook",
      description: "Opening Facebook share dialog in a new window.",
      duration: 3000,
    });
  };
  
  const callContact = (name: string, phone: string) => {
    if (!phone) {
      toast({
        title: "No phone number",
        description: "Please add a phone number for this contact in settings.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Format phone number for tel: protocol
    const formattedPhone = phone.replace(/\s+/g, "");
    window.open(`tel:${formattedPhone}`, '_self');
    
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${phone}...`,
      duration: 3000,
    });
  };
  
  const openTaxiService = (name: string, phone?: string, appUrl?: string) => {
    if (appUrl) {
      window.open(appUrl, '_blank');
      toast({
        title: `Opening ${name}`,
        description: "Launching taxi service app...",
        duration: 3000,
      });
    } else if (phone) {
      const formattedPhone = phone.replace(/\s+/g, "");
      window.open(`tel:${formattedPhone}`, '_self');
      toast({
        title: `Calling ${name}`,
        description: `Dialing ${phone}...`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Missing information",
        description: "Please add a phone number or app link for this taxi service in settings.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  if (!showShareOptions) return null;
  
  return (
    <Card className="mb-5 border-amber-200">
      <CardContent className="pt-6">
        <h2 className="font-semibold text-lg mb-3">Need help getting home?</h2>
        
        {/* Share Action */}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between gap-2 py-5 mb-3 border-blue-300 text-blue-600 hover:bg-blue-50"
          onClick={handleShareFacebook}
        >
          <div className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share on Facebook
          </div>
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        {/* Call Friends Section */}
        <div className="mb-3 border rounded-md overflow-hidden">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between gap-2 py-5 border-green-300 text-green-600 hover:bg-green-50 rounded-none"
            onClick={() => setFriendsExpanded(!friendsExpanded)}
          >
            <div className="flex items-center">
              <PhoneCall className="h-5 w-5 mr-2" />
              Call a Friend
            </div>
            {friendsExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          
          {friendsExpanded && (
            <div className="p-3 bg-gray-50">
              {settings.contacts.filter(contact => contact.name && contact.phone).length > 0 ? (
                <div className="space-y-2">
                  {settings.contacts
                    .filter(contact => contact.name && contact.phone)
                    .map((contact) => (
                      <Button 
                        key={contact.id}
                        variant="outline" 
                        className="w-full flex items-center justify-between text-left py-3"
                        onClick={() => callContact(contact.name, contact.phone)}
                      >
                        <span>{contact.name}</span>
                        <span className="text-sm text-gray-500">{contact.phone}</span>
                      </Button>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-3">No contacts added yet. Add some in Settings!</p>
              )}
            </div>
          )}
        </div>
        
        {/* Taxi Services Section */}
        <div className="border rounded-md overflow-hidden">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between gap-2 py-5 border-yellow-300 text-yellow-600 hover:bg-yellow-50 rounded-none"
            onClick={() => setTaxisExpanded(!taxisExpanded)}
          >
            <div className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Call a Taxi
            </div>
            {taxisExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          
          {taxisExpanded && (
            <div className="p-3 bg-gray-50">
              {settings.taxis.filter(taxi => taxi.name && (taxi.phone || taxi.appUrl)).length > 0 ? (
                <div className="space-y-2">
                  {settings.taxis
                    .filter(taxi => taxi.name && (taxi.phone || taxi.appUrl))
                    .map((taxi) => (
                      <Button 
                        key={taxi.id}
                        variant="outline" 
                        className="w-full flex items-center justify-between text-left py-3"
                        onClick={() => openTaxiService(taxi.name, taxi.phone, taxi.appUrl)}
                      >
                        <span>{taxi.name}</span>
                        <span className="text-sm text-gray-500">
                          {taxi.appUrl ? "Open App" : taxi.phone}
                        </span>
                      </Button>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-3">No taxi services added yet. Add some in Settings!</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}