'use client';

import { createContext, useEffect, useState } from 'react';

import type { Bookmark } from '@/types/bookmark';
import CollectionSelector from '@/components/CollectionSelector';
import CreationDialog from '@/components/CreationDialog';

type CreationOption = 'bookmark' | 'collection';

type ContextProps = {
    isCreationDialogVisible: boolean
    setIsCreationDialogVisible: (visible: boolean) => void
    isCollectionSelectorVisible: boolean
    setIsCollectionSelectorVisible: (visible: boolean) => void
    bookmark?: Omit<Bookmark, 'id'>
    setBookmark: (bookmark: Omit<Bookmark, 'id'>) => void
    setCreationTab: (tab: CreationOption) => void
}

export const DialogsContext = createContext<ContextProps>({
  isCreationDialogVisible: false,
  setIsCreationDialogVisible: (visible: boolean) => {},
  isCollectionSelectorVisible: false,
  setIsCollectionSelectorVisible: (visible: boolean) => {},
  bookmark: undefined,
  setBookmark: (bookmark: Omit<Bookmark, 'id'>) => {},
  setCreationTab: (tab: CreationOption) => {},
});

export function DialogsContextProvider({ children }: {children: React.ReactNode}) {
  const [isBookmarkExtractorVisible, _setIsBookmarkExtractorVisible] = useState(false);
  const [isCollectionSelectorVisible, _setIsCollectionSelectorVisible] = useState(false);
  const [bookmark, _setBookmark] = useState<Omit<Bookmark, 'id'>>();
  const [creationTab, _setCreationTab] = useState('');

  const isDialogOpen = isBookmarkExtractorVisible || isCollectionSelectorVisible;

  const setBookmark = (val: Omit<Bookmark, 'id'>) => _setBookmark(() => val);
  const setIsCollectionSelectorVisible = (val: boolean) => _setIsCollectionSelectorVisible(() => val);
  const setIsBookmarkExtractorVisible = (val: boolean) => _setIsBookmarkExtractorVisible(() => val);
  const setCreationTab = (val: string) => _setCreationTab(() => val);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isDialogOpen);
  }, [isDialogOpen]);

  return (
    <DialogsContext.Provider
      value={{
        isCreationDialogVisible: isBookmarkExtractorVisible,
        setIsCreationDialogVisible: setIsBookmarkExtractorVisible,
        isCollectionSelectorVisible,
        setIsCollectionSelectorVisible,
        bookmark,
        setBookmark,
        setCreationTab,
      }}
    >
      <CollectionSelector
        visible={isCollectionSelectorVisible}
        onHide={() => _setIsCollectionSelectorVisible(false)}
      />
      <CreationDialog
        visible={isBookmarkExtractorVisible}
        selectedTab={creationTab}
        onHide={() => _setIsBookmarkExtractorVisible(false)}
      />
      {children}
    </DialogsContext.Provider>
  );
}
