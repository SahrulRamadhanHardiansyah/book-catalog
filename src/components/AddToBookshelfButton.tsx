// File: components/AddToBookshelfButton.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { GoogleBookVolume } from "@/lib/types";
import { useState } from "react";

interface AddToBookshelfButtonProps {
  book: GoogleBookVolume;
  userId: string;
}

export default function AddToBookshelfButton({ book, userId }: AddToBookshelfButtonProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddBook = async () => {
    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("user_bookshelves").insert({
      user_id: userId,
      book_id: book.id,
      book_title: book.volumeInfo.title,
      book_cover_url: book.volumeInfo.imageLinks?.thumbnail,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage("Buku ini sudah ada di rak bukumu.");
      } else {
        setMessage("Gagal menambahkan buku. Coba lagi.");
        console.error("Error adding book:", error);
      }
    } else {
      setMessage("Berhasil ditambahkan ke Rak Buku!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="mt-6">
      <button onClick={handleAddBook} disabled={isSubmitting} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors">
        {isSubmitting ? "Menambahkan..." : "Tambahkan ke Rak Bukuku"}
      </button>
      {message && <p className={`mt-2 text-sm ${message.includes("Gagal") || message.includes("sudah ada") ? "text-red-500" : "text-green-600"}`}>{message}</p>}
    </div>
  );
}
