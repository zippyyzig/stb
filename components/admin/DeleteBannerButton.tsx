"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteBannerButtonProps {
  bannerId: string;
  bannerTitle: string;
}

export default function DeleteBannerButton({
  bannerId,
  bannerTitle,
}: DeleteBannerButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete banner");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert(error instanceof Error ? error.message : "Failed to delete banner");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-full bg-white p-2 text-destructive transition-colors hover:bg-destructive hover:text-white">
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <DialogPopup className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg">
          <DialogTitle className="heading-lg text-foreground">
            Delete Banner
          </DialogTitle>
          <DialogDescription className="mt-2 text-muted-foreground">
            Are you sure you want to delete &ldquo;{bannerTitle}&rdquo;? This action
            cannot be undone.
          </DialogDescription>

          <div className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
