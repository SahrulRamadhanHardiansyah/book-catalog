import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {currentYear} Katalog Buku Interaktif. Dibuat dengan ❤️ oleh Sahrul.</p>
        <p className="mt-1">
          Didukung oleh{" "}
          <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-blue-500 transition-colors">
            Next.js
          </Link>
          ,{" "}
          <Link href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-green-500 transition-colors">
            Supabase
          </Link>
          , &{" "}
          <Link href="https://developers.google.com/books" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-red-500 transition-colors">
            Google Books API
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
