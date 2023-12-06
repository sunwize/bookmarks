'use client';

import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { AiOutlineLoading } from 'react-icons/ai';
import Drawer from '@/components/Drawer';
import { extractMetaData } from '@/lib/services/jsonlink';
import { CollectionSelectorContext } from '@/lib/composables/useCollectionSelector';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    visible: boolean
    onHide?: () => void
}

export default function BookmarkExtractor({ visible, onHide }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const { setBookmark, setIsCollectionSelectorVisible } = useContext(CollectionSelectorContext);

  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [isExtractingBookmark, setIsExtractingBookmark] = useState(false);

  const extractBookmark = async (url: string) => {
    try {
      setIsExtractingBookmark(true);
      const bookmark = await extractMetaData(url);
      setBookmark(bookmark);
      onHide?.();
      setIsCollectionSelectorVisible(true);
      setBookmarkUrl('');
    } finally {
      setIsExtractingBookmark(false);
    }
  };

  useEffect(() => {
    const url = params.get('description');

    if (visible && url) {
      extractBookmark(url);
      router.push('/');
    }
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      <p className="text-2xl text-center font-bold opacity-80 mb-6">New bookmark</p>
      <label className="text-xl">
        <p className="font-medium mb-1">URL</p>
        <input
          value={bookmarkUrl}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setBookmarkUrl(event.target.value)}
          placeholder="https://..."
          autoFocus={true}
          disabled={isExtractingBookmark}
          className="
            block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2
            focus:border-white
          "
        />
      </label>
      <div className="flex justify-end text-xl mt-6">
        <Button
          onClick={() => extractBookmark(bookmarkUrl)}
          disabled={!bookmarkUrl || isExtractingBookmark}
          className="flex items-center gap-2"
        >
          {
            isExtractingBookmark && (
              <AiOutlineLoading className="animate-spin" />
            )
          }
          Save
        </Button>
      </div>
    </Drawer>
  );
}
