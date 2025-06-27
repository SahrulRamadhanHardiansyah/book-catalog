// File: app/search/page.tsx
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar"; // <-- Impor SearchBar
import { GoogleBookVolume } from "@/lib/types";
import Link from "next/link";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

// Fungsi searchBooks tetap sama, tidak perlu diubah
async function searchBooks(query: string): Promise<GoogleBookVolume[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Books API key is missing.");
  }
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=40`);
  if (!response.ok) {
    throw new Error("Failed to fetch books from Google API.");
  }
  const data = await response.json();
  return data.items || [];
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;

  if (!query) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <SearchIcon />
        </div>
        <h2 className="text-2xl font-bold mb-2">Mulai Pencarian Anda</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Silakan masukkan kata kunci di atas untuk menemukan buku.</p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>
    );
  }

  try {
    const books = await searchBooks(query);

    return (
      <div className="space-y-10">
        <header className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hasil Pencarian</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Untuk kueri: <span className="font-semibold text-blue-500">"{query}"</span>
            </p>
          </div>
          <SearchBar initialQuery={query} />
        </header>

        <main>
          {books.length > 0 ? (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ditemukan {books.length} buku yang relevan.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <div className="flex justify-center mb-4">
                <SearchIcon />
              </div>
              <h2 className="text-xl font-semibold mb-2">Tidak Ada Hasil Ditemukan</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Kami tidak dapat menemukan buku untuk <span className="font-bold">"{query}"</span>.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Coba periksa kembali ejaan atau gunakan kata kunci yang berbeda.</p>
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-red-400/50 bg-red-500/5 dark:bg-red-500/10 rounded-lg">
        <div className="flex justify-center mb-4">
          <WarningIcon />
        </div>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Terjadi Kesalahan</h2>
        <p className="text-red-500 dark:text-red-300">Gagal mengambil data buku dari server.</p>
        <p className="text-xs text-gray-500 mt-2">{(error as Error).message}</p>
      </div>
    );
  }
}
