// File: components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // <-- State untuk URL avatar
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // <-- State untuk dropdown
  const dropdownRef = useRef<HTMLDivElement>(null); // <-- Ref untuk mendeteksi klik di luar dropdown
  const supabase = createClient();
  const router = useRouter();

  // Efek untuk mendeteksi klik di luar dropdown untuk menutupnya
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      // Ambil avatar_url dari user_metadata
      setAvatarUrl(user?.user_metadata?.avatar_url || null);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAvatarUrl(session?.user?.user_metadata?.avatar_url || null);
      // Tutup dropdown saat state auth berubah
      setIsDropdownOpen(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const renderUserMenu = () => {
    if (loading) {
      return <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>;
    }

    if (user && avatarUrl) {
      return (
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <Link
            href="/my-bookshelf"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:text-gray-900 dark:hover:text-white hover:after:w-full"
          >
            Rak Bukuku
          </Link>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="rounded-full overflow-hidden w-10 h-10 border-2 border-transparent hover:border-blue-500 transition-colors">
            <Image src={avatarUrl} alt="User Avatar" width={40} height={40} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.user_metadata?.name || user.email?.split("@")[0]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="w-full text-left rounded-md px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link href="/login">
        <button className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5">Login</button>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gray-900 dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full"
        >
          BookCatalog
        </Link>
        <div>{renderUserMenu()}</div>
      </div>
    </nav>
  );
}
