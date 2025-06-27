// File: app/book/[id]/page.tsx
import { GoogleBookVolume } from "@/lib/types";
import Image from "next/image";
import AddToBookshelfButton from "@/components/AddToBookshelfButton";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

async function getBookDetails(id: string): Promise<GoogleBookVolume> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) throw new Error("Google Books API key is not configured.");
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`);
  if (!response.ok) {
    throw new Error("Failed to fetch book details from Google API.");
  }
  return response.json();
}

function BookStat({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg text-center">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{value || "N/A"}</dd>
    </div>
  );
}

export default async function BookDetailPage(props: BookDetailPageProps) {
  const { id } = props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isBookInBookshelf = false;
  if (user) {
    const { data: existingBook, error } = await supabase.from("user_bookshelves").select("id").eq("user_id", user.id).eq("book_id", id).single();

    if (existingBook) {
      isBookInBookshelf = true;
    }
  }

  try {
    const book = await getBookDetails(id);
    const { volumeInfo } = book;
    const thumbnailUrl = (volumeInfo.imageLinks as { large?: string; smallThumbnail?: string; thumbnail?: string })?.large || volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "/placeholder-cover.png";
    const hasImage = thumbnailUrl !== "/placeholder-cover.png";
    const AlreadyInBookshelf = () => (
      <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
        <p className="font-semibold text-green-800 dark:text-green-300">✓ Sudah ada di Rak Bukuku</p>
        <Link href="/my-bookshelf" className="text-sm text-green-600 dark:text-green-400 hover:underline mt-1">
          Lihat Rak Buku
        </Link>
      </div>
    );

    return (
      <div className="grid md:grid-cols-5 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-2 lg:col-span-1">
          <div className="sticky top-24">
            {hasImage ? (
              <Image src={thumbnailUrl} alt={`Sampul ${volumeInfo.title}`} width={500} height={750} className="rounded-xl shadow-2xl w-full border-4 border-white dark:border-gray-800" />
            ) : (
              <div className="flex items-center justify-center w-full aspect-[2/3] bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
                <p className="text-gray-500">Gambar tidak tersedia</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-2 space-y-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{volumeInfo.title}</h1>
            {volumeInfo.subtitle && <h2 className="mt-1 text-xl text-gray-600 dark:text-gray-400">{volumeInfo.subtitle}</h2>}
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              oleh <span className="font-semibold">{volumeInfo.authors?.join(", ") || "Tidak diketahui"}</span>
            </p>
          </header>

          {user && (isBookInBookshelf ? <AlreadyInBookshelf /> : <AddToBookshelfButton book={book} userId={user.id} />)}

          <section>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <BookStat label="Penerbit" value={volumeInfo.publisher} />
              <BookStat label="Tanggal Terbit" value={volumeInfo.publishedDate} />
              <BookStat label="Jumlah Halaman" value={volumeInfo.pageCount} />
            </dl>
          </section>

          {volumeInfo.description && (
            <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Deskripsi</h3>
              <div className="prose prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: volumeInfo.description }} />
            </section>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-red-400/50 bg-red-500/5 dark:bg-red-500/10 rounded-lg">
        <div className="flex justify-center mb-4">
          <WarningIcon />
        </div>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Gagal Memuat Detail Buku</h2>
        <p className="text-red-500 dark:text-red-300">Data untuk buku ini tidak dapat diambil.</p>
        <p className="text-xs text-gray-500 mt-2">{(error as Error).message}</p>
      </div>
    );
  }
}
