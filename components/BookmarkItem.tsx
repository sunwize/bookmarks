import { Bookmark } from '@/types/bookmark';
import Link from 'next/link';
import BookmarkImage from '@/components/BookmarkImage';

type Props = {
  bookmark: Omit<Bookmark, 'id'>
  onLoadImageError?: (newImageUrl: string) => void
}

export default function BookmarkItem({ bookmark, onLoadImageError }: Props) {
  return (
    <Link
      href={bookmark.url}
      target="_blank"
      className="
        flex gap-2 overflow-hidden bg-white/10 rounded-xl p-2 transition
        active:bg-white/20 md:hover:bg-white/20
      "
    >
      <BookmarkImage
        bookmark={bookmark}
        onError={onLoadImageError}
      />
      <div className="flex-1 overflow-hidden">
        <p className="font-bold truncate mb-1">{bookmark.title}</p>
        <p className="text-sm opacity-80 line-clamp-2">{bookmark.description}</p>
      </div>
    </Link>
  );
}
