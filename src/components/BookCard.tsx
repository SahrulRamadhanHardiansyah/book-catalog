// File: components/BookCard.tsx
import { GoogleBookVolume } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

// Komponen Ikon sederhana untuk placeholder
const BookPlaceholderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.995l11.494 0M4.5 12.747l3.75-3.75M19.5 7.253l-3.75 3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 19.5V4.5a1.5 1.5 0 011.5-1.5h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5z" />
  </svg>
);

interface BookCardProps {
  book: GoogleBookVolume;
}

export default function BookCard({ book }: BookCardProps) {
  const { volumeInfo } = book;
  const thumbnailUrl = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "/placeholder-cover.png";
  const hasImage = thumbnailUrl !== "/placeholder-cover.png";

  return (
    <Link href={`/book/${book.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-102 group-hover:shadow-2xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-blue-400/10">
        <div className="relative w-full pt-[150%]">
          {hasImage ? (
            <Image
              src={thumbnailUrl}
              alt={`Sampul buku ${volumeInfo.title}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="transition-transform duration-300 ease-in-out group-hover:scale-102"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <BookPlaceholderIcon />
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-md leading-tight text-gray-800 dark:text-gray-100 truncate">{volumeInfo.title}</h3>
          {volumeInfo.authors && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{volumeInfo.authors.join(", ")}</p>}
        </div>
      </div>
    </Link>
  );
}
