import { Bookmark } from '@/types/bookmark';
import Link from 'next/link';
import { MdOutlineHideImage } from 'react-icons/md';

interface Props {
  bookmark: Omit<Bookmark, 'id'>
  onLoadImageError?: () => void
}

export default function BookmarkItem({ bookmark, onLoadImageError }: Props) {
  const thumbnail = bookmark.image_url;

  return (
    <Link
      href={bookmark.url}
      target="_blank"
      className="
        flex gap-3 overflow-hidden bg-white/10 rounded-xl p-2 md:px-3 md:py-2 transition
        active:bg-white/20 md:hover:bg-white/20
      "
    >
      {
        thumbnail ? (
          <img
            onError={onLoadImageError}
            src={thumbnail}
            alt={bookmark.title}
            className="w-[70px] aspect-square object-cover rounded-xl"
          />
        ) : (
          <div className="flex items-center justify-center w-[70px] aspect-square bg-white/10 rounded-xl">
            <MdOutlineHideImage
              size={50}
              className="opacity-50"
            />
          </div>
        )
      }
      <div className="flex-1 overflow-hidden">
        <p className="font-bold truncate mb-1">{bookmark.title}</p>
        <p className="text-sm opacity-80 line-clamp-2">{bookmark.description}</p>
      </div>
    </Link>
  );
}
