import Image from 'next/image';
import { useRef, useState } from 'react';
import { useSupabase } from '@/lib/composables/useSupabase';
import { extractMetadata } from '@/lib/utils/metadata';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MdOutlineHideImage } from 'react-icons/md';

type Props = {
    bookmark: {
        id?: string
        user_id?: string
        title: string
        url: string
        image_url: string
    }
    className?: string
    onError?: (newImageUrl: string) => void
}

export default function BookmarkImage({ bookmark, className, onError }: Props) {
  const supabase = useSupabase();
  const { user } = useAuth();

  const [isFallback, setIsFallback] = useState(false);
  const isLoadError = useRef(false);

  const updateImageUrl = async () => {
    if (!user || !bookmark.id) {
      return '';
    }

    if (bookmark.user_id && user.id !== bookmark.user_id) {
      return '';
    }

    const { image_url: imageUrl } = await extractMetadata(bookmark.url);
    await supabase.from('bookmarks')
      .update({
        image_url: imageUrl,
      })
      .eq('id', bookmark.id);

    return imageUrl;
  };

  const _onLoadImageError = async () => {
    setIsFallback(true);
    if (isLoadError.current) {
      return;
    }

    isLoadError.current = true;
    const newImageUrl = await updateImageUrl();
    onError?.(newImageUrl);
  };

  return (
    !isFallback ? (
      <Image
        src={bookmark.image_url}
        alt={bookmark.title}
        width={150}
        height={150}
        quality={100}
        onError={_onLoadImageError}
        className={`aspect-square object-cover rounded-xl ${className}`}
      />
    ) : (
      <div className={`flex items-center justify-center w-[70px] aspect-square bg-white/10 rounded-xl ${className}`}>
        <MdOutlineHideImage
          size="80%"
          className="opacity-50"
        />
      </div>
    )
  );
}
