import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddContact: () => void;
}

const EmptyState = ({ onAddContact }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-block p-6 bg-secondary rounded-full">
          <UserPlus className="h-16 w-16 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">
          No contacts yet
        </h2>
        
        <p className="text-muted-foreground mb-8 text-base">
          Your contact list is empty. Start building your network by adding your first contact!
        </p>
        
        <Button
          onClick={onAddContact}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add Your First Contact
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
