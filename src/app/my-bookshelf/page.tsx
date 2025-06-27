// File: app/my-bookshelf/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RemoveBookButton from "./RemoveBookButton";

const BookshelfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default async function MyBookshelfPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: books, error } = await supabase.from("user_bookshelves").select("id, book_id, book_title, book_cover_url").eq("user_id", user.id).order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-red-400/50 bg-red-500/5 dark:bg-red-500/10 rounded-lg">
        <div className="flex justify-center mb-4">
          <WarningIcon />
        </div>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Memuat Rak Buku</h2>
        <p className="text-red-500 dark:text-red-300">Gagal mengambil data buku dari server.</p>
        <p className="text-xs text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Rak Bukuku</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Buku-buku yang telah Anda simpan.</p>
      </header>

      {books && books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {books.map((book) => (
            <div key={book.id} className="group relative">
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-102 group-hover:shadow-2xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-blue-400/10">
                <Link href={`/book/${book.book_id}`} className="flex flex-col h-full">
                  <div className="relative w-full pt-[150%]">
                    <Image src={book.book_cover_url || "/placeholder-cover.png"} alt={`Sampul ${book.book_title}`} fill style={{ objectFit: "cover" }} className="transition-transform duration-300 group-hover:scale-102" />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="font-semibold text-sm leading-tight text-gray-800 dark:text-gray-100 truncate">{book.book_title}</p>
                  </div>
                </Link>
              </div>
              <RemoveBookButton bookshelfEntryId={book.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex justify-center mb-4">
            <BookshelfIcon />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Rak Bukumu Masih Kosong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Simpan buku yang Anda temukan untuk membacanya nanti. Mari kita mulai mengisi rak ini!</p>
          <Link href="/" className="inline-block px-6 py-3 text-sm font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5">
            Mulai Cari Buku
          </Link>
        </div>
      )}
    </div>
  );
}
