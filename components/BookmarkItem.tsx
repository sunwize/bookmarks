import { Bookmark } from '@/types/bookmark';
import Link from 'next/link';

interface Props {
    bookmark: Omit<Bookmark, 'id'>
}

export default function BookmarkItem({ bookmark }: Props) {
  const thumbnail = bookmark.image_url;

  return (
    <Link
      href={bookmark.url}
      target="_blank"
      className="
        flex gap-3 overflow-hidden bg-white/10 rounded-xl px-3 py-2 transition
        active:bg-white/20 md:hover:bg-white/20
      "
    >
      <img
        src={thumbnail}
        alt={bookmark.title}
        className="w-[70px] aspect-square object-cover rounded-xl"
      />
      <div className="flex-1 overflow-hidden">
        <p className="font-bold truncate mb-1">{bookmark.title}</p>
        <p className="text-sm opacity-80 line-clamp-2">{bookmark.description}</p>
      </div>
    </Link>
  );
}
