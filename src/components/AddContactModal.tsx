import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/api/contacts";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: { name: string; email?: string; phone?: string; avatar?: string }) => void;
  editContact?: { id: string; name: string; email?: string; phone?: string; avatar?: string };
  onEdit?: (id: string, contact: { name: string; email?: string; phone?: string; avatar?: string }) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const AddContactModal = ({ isOpen, onClose, onAdd, editContact, onEdit }: AddContactModalProps) => {
  const isEditMode = !!editContact;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate form when editing
  useEffect(() => {
    if (editContact) {
      setFormData({
        name: editContact.name,
        email: editContact.email || "",
        phone: editContact.phone || "",
        avatar: editContact.avatar || "",
      });
    }
  }, [editContact]);

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field

    // Basic RFC-like email shape
    const basicRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!basicRegex.test(email)) return false;

    const [local, domainFull] = email.split("@");
    if (!local || local.trim().length < 2) return false; // username too short

    const parts = domainFull.toLowerCase().split(".");
    if (parts.length < 2) return false;
    const tld = parts[parts.length - 1];
    const sld = parts[parts.length - 2]; // second-level domain (e.g., gmail)

    // Enforce reasonable domain rules
    if (!sld || sld.length < 2) return false; // disallow things like g.com

    // Known full-domain typos
    const typoDomains: Record<string, string> = {
      "gamil.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "yahooo.com": "yahoo.com",
      "yaho.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "outlok.com": "outlook.com",
      "outloo.com": "outlook.com",
    };
    if (typoDomains[`${sld}.${tld}`]) return false;

    // Likely-short SLD typos that should be gmail
    const sldTypos: Record<string, string> = {
      g: "gmail",
      gm: "gmail",
      gma: "gmail",
      gmai: "gmail",
      gml: "gmail",
      gmal: "gmail",
    };
    if (tld === "com" && sldTypos[sld]) return false;

    return true;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (formData.email && !validateEmail(formData.email)) {
      const domain = formData.email.split('@')[1]?.toLowerCase();
      const commonTypos: Record<string, string> = {
        'gamil.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'yaho.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com',
        'outlok.com': 'outlook.com',
        'outloo.com': 'outlook.com',
      };
      
      if (domain && commonTypos[domain]) {
        newErrors.email = `Did you mean ${formData.email.split('@')[0]}@${commonTypos[domain]}?`;
      } else {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = async (files: File[]) => {
    const file = files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // Upload image via API
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true });

    if (validateForm()) {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        avatar: formData.avatar || undefined,
      };

      if (isEditMode && editContact && onEdit) {
        onEdit(editContact.id, contactData);
      } else {
        onAdd(contactData);
      }

      // Reset form
      setFormData({ name: "", email: "", phone: "", avatar: "" });
      setErrors({});
      setTouched({});
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "", avatar: "" });
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {isEditMode ? "Edit Contact" : "Add New Contact"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isEditMode 
                  ? "Update the contact details below." 
                  : "Fill in the details to add a new contact to your list."
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Photo</Label>
            {formData.avatar ? (
              <div className="relative w-full">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-border shadow-lg">
                  <img 
                    src={formData.avatar} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-0 right-1/2 translate-x-16 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-lg overflow-hidden">
                <FileUpload onChange={handleImageUpload} accept="image/*" />
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="John Doe"
              className={`h-11 ${touched.name && errors.name ? "border-destructive focus:ring-destructive" : ""}`}
              maxLength={100}
            />
            {touched.name && errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="john.doe@example.com"
              className={`h-11 ${touched.email && errors.email ? "border-destructive focus:ring-destructive" : ""}`}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="+1 (555) 123-4567"
              className={`h-11 ${touched.phone && errors.phone ? "border-destructive focus:ring-destructive" : ""}`}
            />
            {touched.phone && errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-primary hover:bg-primary/90"
            >
              {isEditMode ? "Save Changes" : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
