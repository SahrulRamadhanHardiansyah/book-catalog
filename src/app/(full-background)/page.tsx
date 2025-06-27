import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative z-10 container mx-auto flex flex-col items-center justify-center px-4 text-center py-24 md:py-32">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300">Temukan Buku Favoritmu</h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mx-auto max-w-2xl">Jelajahi jutaan buku dari Google Books dan buat rak buku pribadimu.</p>
        </div>

        <div className="w-full max-w-2xl mt-10">
          <SearchBar />
        </div>
      </div>

    </section>
  );
}
