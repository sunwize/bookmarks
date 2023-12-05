'use client';

import { createContext, useState } from 'react';
import CollectionSelector from '@/components/CollectionSelector';
import { Bookmark } from '@/types/bookmark';
import BookmarkExtractor from '@/components/BookmarkExtractor';

interface ContextProps {
    isBookmarkExtractorVisible: boolean
    setIsBookmarkExtractorVisible: (visible: boolean) => void
    isCollectionSelectorVisible: boolean
    setIsCollectionSelectorVisible: (visible: boolean) => void
    bookmark?: Omit<Bookmark, 'id'>
    setBookmark: (bookmark: Omit<Bookmark, 'id'>) => void
}

export const CollectionSelectorContext = createContext<ContextProps>({
  isBookmarkExtractorVisible: false,
  setIsBookmarkExtractorVisible: (visible: boolean) => {},
  isCollectionSelectorVisible: false,
  setIsCollectionSelectorVisible: (visible: boolean) => {},
  bookmark: undefined,
  setBookmark: (bookmark: Omit<Bookmark, 'id'>) => {},
});

export function CollectionSelectorContextProvider({ children }: {children: React.ReactNode}) {
  const [isBookmarkExtractorVisible, _setIsBookmarkExtractorVisible] = useState(false);
  const [isCollectionSelectorVisible, _setIsCollectionSelectorVisible] = useState(false);
  const [bookmark, _setBookmark] = useState<Omit<Bookmark, 'id'>>();

  const setBookmark = (val: Omit<Bookmark, 'id'>) => _setBookmark(() => val);
  const setIsCollectionSelectorVisible = (val: boolean) => _setIsCollectionSelectorVisible(() => val);
  const setIsBookmarkExtractorVisible = (val: boolean) => _setIsBookmarkExtractorVisible(() => val);

  return (
    <CollectionSelectorContext.Provider
      value={{
        isBookmarkExtractorVisible,
        setIsBookmarkExtractorVisible,
        isCollectionSelectorVisible,
        setIsCollectionSelectorVisible,
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
      {children}
    </CollectionSelectorContext.Provider>
  );
}
