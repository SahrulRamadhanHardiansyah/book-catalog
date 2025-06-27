// File: app/my-bookshelf/RemoveBookButton.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface RemoveBookButtonProps {
  bookshelfEntryId: string;
}

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export default function RemoveBookButton({ bookshelfEntryId }: RemoveBookButtonProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus buku ini dari rak Anda?");
    if (confirmed) {
      startTransition(async () => {
        await supabase.from("user_bookshelves").delete().eq("id", bookshelfEntryId);

        router.refresh();
      });
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed"
      aria-label="Hapus dari rak buku"
    >
      {isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <TrashIcon />}
    </button>
  );
}
