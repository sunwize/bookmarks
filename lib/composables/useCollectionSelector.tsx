'use client';

import { createContext, useEffect, useState } from 'react';
import CollectionSelector from '@/components/CollectionSelector';
import { Bookmark } from '@/types/bookmark';
import BookmarkExtractor from '@/components/BookmarkExtractor';
import CollectionCreator from '@/components/CollectionCreator';

interface ContextProps {
    isBookmarkExtractorVisible: boolean
    setIsBookmarkExtractorVisible: (visible: boolean) => void
    isCollectionSelectorVisible: boolean
    setIsCollectionSelectorVisible: (visible: boolean) => void
    isCollectionCreatorVisible: boolean
    setIsCollectionCreatorVisible: (visible: boolean) => void
    bookmark?: Omit<Bookmark, 'id'>
    setBookmark: (bookmark: Omit<Bookmark, 'id'>) => void
}

export const CollectionSelectorContext = createContext<ContextProps>({
  isBookmarkExtractorVisible: false,
  setIsBookmarkExtractorVisible: (visible: boolean) => {},
  isCollectionSelectorVisible: false,
  setIsCollectionSelectorVisible: (visible: boolean) => {},
  isCollectionCreatorVisible: false,
  setIsCollectionCreatorVisible: (visible: boolean) => {},
  bookmark: undefined,
  setBookmark: (bookmark: Omit<Bookmark, 'id'>) => {},
});

export function CollectionSelectorContextProvider({ children }: {children: React.ReactNode}) {
  const [isBookmarkExtractorVisible, _setIsBookmarkExtractorVisible] = useState(false);
  const [isCollectionSelectorVisible, _setIsCollectionSelectorVisible] = useState(false);
  const [isCollectionCreatorVisible, _setIsCollectionCreatorVisible] = useState(false);
  const [bookmark, _setBookmark] = useState<Omit<Bookmark, 'id'>>();

  const isDialogOpen = isBookmarkExtractorVisible || isCollectionSelectorVisible || isCollectionCreatorVisible;

  const setBookmark = (val: Omit<Bookmark, 'id'>) => _setBookmark(() => val);
  const setIsCollectionSelectorVisible = (val: boolean) => _setIsCollectionSelectorVisible(() => val);
  const setIsBookmarkExtractorVisible = (val: boolean) => _setIsBookmarkExtractorVisible(() => val);
  const setIsCollectionCreatorVisible = (val: boolean) => {
    _setIsCollectionCreatorVisible(() => val);

    if (!val) {
      _setIsCollectionSelectorVisible(() => true);
    }
  };

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isDialogOpen);
  }, [isDialogOpen]);

  return (
    <CollectionSelectorContext.Provider
      value={{
        isBookmarkExtractorVisible,
        setIsBookmarkExtractorVisible,
        isCollectionSelectorVisible,
        setIsCollectionSelectorVisible,
        isCollectionCreatorVisible,
        setIsCollectionCreatorVisible,
        bookmark,
        setBookmark,
      }}
    >
      <BookmarkExtractor
        visible={isBookmarkExtractorVisible}
        onHide={() => _setIsBookmarkExtractorVisible(false)}
      />
      <CollectionSelector
        visible={isCollectionSelectorVisible}
        onHide={() => _setIsCollectionSelectorVisible(false)}
      />
      <CollectionCreator
        visible={isCollectionCreatorVisible}
        onHide={() => setIsCollectionCreatorVisible(false)}
      />
      {children}
    </CollectionSelectorContext.Provider>
  );
}
