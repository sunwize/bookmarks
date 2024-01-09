'use client';

import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

import { Bookmark, BookmarkCollection } from '@/types/bookmark';
import { extractMetadata } from '@/lib/utils/metadata';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import { useSupabase } from '@/lib/composables/useSupabase';
import { useSharedUrl } from '@/lib/composables/useSharedUrl';
import Button from '@/components/ui/Button';
import Tab from '@/components/ui/Tab';
import Drawer from '@/components/ui/Drawer';
import { getAuthenticatedUser } from '@/lib/utils/auth';

type Props = {
  visible: boolean
  selectedTab?: string
  onHide?: () => void
}

export default function CreationDialog({ visible, selectedTab = 'bookmark', onHide }: Props) {
  const supabase = useSupabase();
  const { url: sharedUrl } = useSharedUrl();
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { setBookmark, setIsCollectionSelectorVisible, setIsCreationDialogVisible } = useContext(DialogsContext);

  const [tab, setTab] = useState(selectedTab);

  // Bookmark
  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [isExtractingBookmark, setIsExtractingBookmark] = useState(false);

  // Collection
  const [collectionName, setCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  const saveBookmarkToCollection = async (bookmark: Omit<Bookmark, 'id'>) => {
    await supabase.from('bookmarks')
      .insert({
        list_id: id,
        title: bookmark.title,
        description: bookmark.description,
        url: bookmark.url,
        image_url: bookmark.image_url,
        sitename: bookmark.sitename,
        domain: bookmark.domain,
      });
    toast('Bookmark saved', { type: 'success' });
  };

  const extractBookmark = async (url: string) => {
    try {
      setIsExtractingBookmark(true);
      const bookmark = await extractMetadata(url);
      setBookmark(bookmark);

      onHide?.();
      setIsCreationDialogVisible(false);
      setBookmarkUrl('');

      if (!sharedUrl && pathname.startsWith('/collection/')) {
        await saveBookmarkToCollection(bookmark);
      } else {
        setIsCollectionSelectorVisible(true);
      }
    } finally {
      setIsExtractingBookmark(false);
    }
  };

  const saveCollection = async () => {
    if (!collectionName) {
      return;
    }

    try {
      setIsCreatingCollection(true);
      const user = await getAuthenticatedUser();

      const { data: collection, error }: PostgrestSingleResponse<BookmarkCollection> = await supabase
        .from('bookmark_lists')
        .insert({
          title: collectionName,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setIsCreationDialogVisible(false);
      router.push(`/collection/${collection.id}`);
      setCollectionName('');
    } finally {
      setIsCreatingCollection(false);
    }
  };

  useEffect(() => {
    if (visible && sharedUrl) {
      extractBookmark(sharedUrl);
      router.push('/');
    }
  }, [visible]);

  useEffect(() => {
    setTab(() => selectedTab);
  }, [visible, selectedTab]);

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      <Tab className="pt-3 md:pt-6 px-3 md:px-6 mb-6">
        <div className="flex items-center gap-2">
          <Tab.Item
            value="bookmark"
            selectedTab={tab}
            onClick={setTab}
          >
            New bookmark
          </Tab.Item>
          <Tab.Item
            value="collection"
            selectedTab={tab}
            onClick={setTab}
          >
            New collection
          </Tab.Item>
        </div>

        <hr className="border-white/20 my-3 md:my-6 -mx-3 md:-mx-6" />

        <Tab.Content
          value="bookmark"
          selectedTab={tab}
        >
          <label>
            <p className="font-medium mb-1">Bookmark URL</p>
            <input
              value={bookmarkUrl}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setBookmarkUrl(event.target.value)}
              placeholder="https://..."
              autoFocus={false}
              disabled={isExtractingBookmark}
              className="
                block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2
                focus:border-white
              "
            />
          </label>
          <div className="text-xl mt-6">
            <Button
              onClick={() => extractBookmark(bookmarkUrl)}
              disabled={!bookmarkUrl || isExtractingBookmark}
              className="flex items-center justify-center gap-2 w-full"
            >
              {
                isExtractingBookmark && (
                  <AiOutlineLoading className="animate-spin" />
                )
              }
              Create bookmark
            </Button>
          </div>
        </Tab.Content>
        <Tab.Content
          value="collection"
          selectedTab={tab}
        >
          <label>
            <p className="font-medium mb-1">Collection name</p>
            <input
              value={collectionName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCollectionName(event.target.value)}
              placeholder="eg: Date ideas"
              autoFocus={false}
              disabled={isCreatingCollection}
              className="
                block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2
                focus:border-white
              "
            />
          </label>
          <div className="text-xl mt-6">
            <Button
              onClick={saveCollection}
              disabled={!collectionName || isCreatingCollection}
              className="flex items-center justify-center gap-2 w-full"
            >
              {
                isCreatingCollection && (
                  <AiOutlineLoading className="animate-spin" />
                )
              }
              Create collection
            </Button>
          </div>
        </Tab.Content>
      </Tab>
    </Drawer>
  );
}
