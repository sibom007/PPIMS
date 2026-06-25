import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record and remove all associated data from our servers.",
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    // Prevent the modal from closing automatically if it's an async operation
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose(); // Close only after successful deletion
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={isDeleting ? undefined : onClose}>
      <AlertDialogContent className="w-[92%] max-w-md rounded-xl sm:rounded-lg gap-6">
        <AlertDialogHeader className="flex flex-col items-center text-center sm:text-left sm:items-start gap-3">
          {/* Mobile-friendly semantic warning icon placement */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:h-12 sm:w-12">
            <AlertTriangle
              className="h-5 w-5 text-destructive"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1">
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 ">
          <AlertDialogCancel
            disabled={isDeleting}
            variant={"outline"}
            className={cn("w-full sm:w-auto mt-0")}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            variant={"destructive"}
            className={cn("w-full sm:w-auto")}
          >
            {isDeleting ? (
              <span>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete Record"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
