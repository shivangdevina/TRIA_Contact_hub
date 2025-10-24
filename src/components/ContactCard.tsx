import { Pencil, Trash2, Mail, Phone, Copy, QrCode } from "lucide-react";
import { Contact } from "./ContactList";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  avatarUrl: string;
  borderColor: string;
  bulkSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const ContactCard = ({ 
  contact, 
  onEdit, 
  onDelete, 
  avatarUrl, 
  borderColor,
  bulkSelectMode = false,
  isSelected = false,
  onToggleSelect
}: ContactCardProps) => {
  const [showQRCode, setShowQRCode] = useState(false);

  const handleCopyContact = async () => {
    const contactText = `
Name: ${contact.name}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.phone ? `Phone: ${contact.phone}` : ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(contactText);
      
      // PRODUCTION API CALL:
      // Track copy event for analytics
      // await fetch('https://api.yourdomain.com/api/v1/analytics/events', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     event: 'contact_copied',
      //     contactId: contact.id,
      //     timestamp: new Date().toISOString()
      //   }),
      // });
      
      toast({
        title: "Copied!",
        description: "Contact details copied to clipboard.",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy contact details.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const getContactVCard = () => {
    // Generate vCard format for QR code
    return `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
${contact.email ? `EMAIL:${contact.email}` : ''}
${contact.phone ? `TEL:${contact.phone}` : ''}
END:VCARD`;
  };

  const handleShowQRCode = () => {
    setShowQRCode(true);
    
    // PRODUCTION API CALL:
    // Track QR code generation for analytics
    // await fetch('https://api.yourdomain.com/api/v1/analytics/events', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     event: 'qr_code_generated',
    //     contactId: contact.id,
    //     timestamp: new Date().toISOString()
    //   }),
    // });
  };

  return (
    <div 
      className={`group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
        isSelected ? "ring-4 ring-primary" : ""
      }`}
      onClick={bulkSelectMode ? onToggleSelect : undefined}
      style={{ cursor: bulkSelectMode ? "pointer" : "default" }}
    >
      {/* Bulk Select Checkbox */}
      {bulkSelectMode && (
        <div className="absolute top-3 left-3 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-background/90 backdrop-blur-sm"
          }`}>
            {isSelected ? "✓" : ""}
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={avatarUrl} 
          alt={contact.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          style={{
            borderBottom: `4px solid ${borderColor}`
          }}
        />
        
        {/* Action Buttons */}
        {!bulkSelectMode && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
            onClick={handleCopyContact}
            className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Copy contact"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleShowQRCode}
            className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Show QR code"
          >
            <QrCode className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Edit contact"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="bg-destructive/90 backdrop-blur-sm hover:bg-destructive text-destructive-foreground p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Delete contact"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1 truncate">
            {contact.name}
          </h3>
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Phone className="h-4 w-4 shrink-0" />
              <span className="truncate">{contact.phone}</span>
            </div>
          )}
          {!contact.email && !contact.phone && (
            <p className="text-sm text-muted-foreground">No contact info</p>
          )}
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to save {contact.name}'s contact information
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center p-6 bg-white rounded-lg">
            <QRCodeSVG 
              value={getContactVCard()} 
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactCard;
