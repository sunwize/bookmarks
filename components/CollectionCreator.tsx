'use client';

import Drawer from '@/components/Drawer';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { AiOutlineLoading } from 'react-icons/ai';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { BookmarkList } from '@/types/bookmark';
import { CollectionSelectorContext } from '@/lib/composables/useCollectionSelector';

interface Props {
    visible: boolean
    onHide?: () => void
}

export default function CollectionCreator({ visible, onHide }: Props) {
  const supabase = useSupabase();
  const { setIsCollectionCreatorVisible } = useContext(CollectionSelectorContext);

  const [collectionName, setCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const saveCollection = async () => {
    if (!collectionName) {
      return;
    }

    try {
      setIsCreating(true);
      await supabase
        .from('bookmark_lists')
        .insert({
          title: collectionName,
        });
      setIsCollectionCreatorVisible(false);
      setCollectionName('');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    setCollectionName('');
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      <p className="text-2xl text-center font-bold opacity-80 mb-6">New Collection</p>
      <label className="text-xl">
        <p className="font-medium mb-1">Collection</p>
        <input
          value={collectionName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setCollectionName(event.target.value)}
          placeholder="eg: Date ideas"
          autoFocus={true}
          disabled={isCreating}
          className="
            block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2
            focus:border-white
          "
        />
      </label>
      <div className="flex justify-end text-xl mt-6">
        <Button
          onClick={saveCollection}
          disabled={!collectionName || isCreating}
          className="flex items-center gap-2"
        >
          {
            isCreating && (
              <AiOutlineLoading className="animate-spin" />
            )
          }
          Save
        </Button>
      </div>
    </Drawer>
  );
}
