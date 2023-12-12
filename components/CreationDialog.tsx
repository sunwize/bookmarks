'use client';

import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { AiOutlineLoading } from 'react-icons/ai';
import Drawer from '@/components/Drawer';
import { extractMetadata } from '@/lib/utils/metadata';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Tab from '@/components/Tab';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Bookmark, BookmarkList } from '@/types/bookmark';
import { useSharedUrl } from '@/lib/composables/useSharedUrl';

interface Props {
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
      const { data: collection, error }: PostgrestSingleResponse<BookmarkList> = await supabase
        .from('bookmark_lists')
        .insert({
          title: collectionName,
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
      <Tab className="mb-6">
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

        <hr className="border-white/20 my-3 -mx-3 md:-mx-6" />

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
              autoFocus={true}
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
              autoFocus={true}
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
