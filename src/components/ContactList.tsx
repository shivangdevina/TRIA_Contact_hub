import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SpeedDial } from "primereact/speeddial";
import { useTheme } from "next-themes";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "./SearchBar";
import AddContactModal from "./AddContactModal";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ContactCard from "./ContactCard";
import { BackgroundBeams } from "./ui/background-beams";
import * as contactsApi from "@/lib/api/contacts";
import contactHubLogo from "@/assets/contact-hub-logo.png";

type SortOption = "name-asc" | "name-desc" | "email-asc" | "email-desc" | "recent";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

const ContactList = () => {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: contactsApi.fetchContacts,
  });

  // Create contact mutation
  const createMutation = useMutation({
    mutationFn: contactsApi.createContact,
    onSuccess: (newContact) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsModalOpen(false);
      toast({
        title: "Contact added successfully!",
        description: `${newContact.name} has been added to your contacts.`,
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Update contact mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Omit<Contact, "id"> }) =>
      contactsApi.updateContact(id, updates),
    onSuccess: (updatedContact) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsModalOpen(false);
      setEditingContact(undefined);
      toast({
        title: "Contact updated successfully!",
        description: `${updatedContact.name} has been updated.`,
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: contactsApi.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      if (contactToDelete) {
        toast({
          title: "Contact deleted",
          description: `${contactToDelete.name} has been removed from your contacts.`,
          duration: 3000,
        });
      }
      setContactToDelete(null);
      setDeleteConfirmOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setDeleteConfirmOpen(false);
    },
  });

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.phone?.includes(query)
    );
  }, [contacts, searchQuery]);

  const sortedContacts = useMemo(() => {
    const sorted = [...filteredContacts];
    
    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "email-asc":
        return sorted.sort((a, b) => {
          const emailA = a.email || "";
          const emailB = b.email || "";
          return emailA.localeCompare(emailB);
        });
      case "email-desc":
        return sorted.sort((a, b) => {
          const emailA = a.email || "";
          const emailB = b.email || "";
          return emailB.localeCompare(emailA);
        });
      case "recent":
        return sorted.reverse(); // Most recently added first
      default:
        return sorted;
    }
  }, [filteredContacts, sortOption]);

  const handleAddContact = (newContact: Omit<Contact, "id">) => {
    createMutation.mutate(newContact);
  };

  const handleEditContact = (id: string, updatedContact: Omit<Contact, "id">) => {
    updateMutation.mutate({ id, updates: updatedContact });
  };

  const handleOpenEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(undefined);
  };

  const handleOpenDeleteDialog = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      deleteMutation.mutate(contactToDelete.id);
    }
  };


  const handleExportContacts = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: `Exported ${contacts.length} contact(s) to JSON.`,
      duration: 3000,
    });
  };

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const speedDialItems = [
    {
      label: "Add Contact",
      icon: "pi pi-plus",
      command: () => setIsModalOpen(true),
    },
    {
      label: "Export Contacts",
      icon: "pi pi-download",
      command: handleExportContacts,
    },
    {
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      icon: theme === "dark" ? "pi pi-sun" : "pi pi-moon",
      command: handleToggleTheme,
    },
  ];

  const showEmptySearch = searchQuery.trim() && sortedContacts.length === 0;
  const showEmptyState = !searchQuery.trim() && contacts.length === 0 && !isLoading;

  // Avatar colors for ChromaGrid
  const AVATAR_COLORS = [
    { border: '#4F46E5', gradient: 'linear-gradient(145deg, #4F46E5, #000)' },
    { border: '#10B981', gradient: 'linear-gradient(210deg, #10B981, #000)' },
    { border: '#F59E0B', gradient: 'linear-gradient(165deg, #F59E0B, #000)' },
    { border: '#EF4444', gradient: 'linear-gradient(195deg, #EF4444, #000)' },
    { border: '#8B5CF6', gradient: 'linear-gradient(225deg, #8B5CF6, #000)' },
    { border: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4, #000)' },
    { border: '#EC4899', gradient: 'linear-gradient(180deg, #EC4899, #000)' },
    { border: '#F97316', gradient: 'linear-gradient(150deg, #F97316, #000)' }
  ];

  // Convert contacts to ParallaxScroll cards
  const contactCards = useMemo(() => {
    return sortedContacts.map((contact, index) => {
      const colorScheme = AVATAR_COLORS[index % AVATAR_COLORS.length];
      
      // Use uploaded avatar or generate avatar image URL with initials
      const avatarUrl = contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&size=400&background=${colorScheme.border.replace('#', '')}&color=fff&bold=true&format=svg`;
      
      return (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={() => handleOpenEditModal(contact)}
          onDelete={() => handleOpenDeleteDialog(contact)}
          avatarUrl={avatarUrl}
          borderColor={colorScheme.border}
          bulkSelectMode={false}
          isSelected={false}
          onToggleSelect={() => {}}
        />
      );
    });
  }, [sortedContacts]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Speed Dial */}
      <SpeedDial 
        model={speedDialItems} 
        radius={120} 
        type="quarter-circle" 
        direction="up-left" 
        style={{ right: 16, bottom: 16, position: 'fixed', zIndex: 50 }}
        className="speeddial-custom"
      />

      {/* Background Beams */}
      <BackgroundBeams className="z-0" />
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm shadow-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={contactHubLogo} alt="Contact-Hub Logo" className="h-12 sm:h-14" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Contact-Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLoading ? "Loading..." : `${contacts.length} ${contacts.length === 1 ? 'contact' : 'contacts'}`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Contact
            </Button>
          </div>

          {/* Search Bar and Sort */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search contacts by name..."
              />
            </div>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingState />
        ) : showEmptyState ? (
          <EmptyState onAddContact={() => setIsModalOpen(true)} />
        ) : showEmptySearch ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No contacts found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any contacts matching "{searchQuery}". Try searching with a different name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {contactCards}
          </div>
        )}
      </main>

      {/* Add/Edit Contact Modal */}
      <AddContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddContact}
        editContact={editingContact}
        onEdit={handleEditContact}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactList;
