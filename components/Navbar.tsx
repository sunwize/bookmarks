'use client';

import { FiBookmark, FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isBackButtonVisible = pathname !== '/';

  return (
    <nav className="z-10 w-full text-2xl md:text-3xl shrink-0 sticky top-0 bg-black max-w-[650px] mx-auto">
      <h1 className="flex items-center justify-center uppercase tracking-wide font-black py-3 md:py-6">
        <span>Bookm</span>
        <FiBookmark className="mx-[-2px]" />
        <span>rks</span>
      </h1>
      {
        isBackButtonVisible && (
          <Link
            href="/"
            className="absolute top-1/2 left-2 md:left-6 -translate-y-1/2"
          >
            <FiChevronLeft />
          </Link>
        )
      }
    </nav>
  );
}
