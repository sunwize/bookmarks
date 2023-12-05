'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { CollectionSelectorContext } from '@/lib/composables/useCollectionSelector';

export default function Shared() {
  const router = useRouter();
  const params = useSearchParams();
  const { setIsBookmarkExtractorVisible } = useContext(CollectionSelectorContext);

  const url = params.get('url');

  // useEffect(() => {
  //   if (!url) {
  //     return router.push('/');
  //   }
  //
  //   setIsBookmarkExtractorVisible(true);
  // }, []);

  return (
    <>
      <h1 className="text-center text-xl font-bold mb-6">A link has been shared!</h1>
      <ul>
        {
          Array.from(params.entries()).map(([key, value], index) => (
            <li key={index}>{key}: {value}</li>
          ))
        }
      </ul>
    </>
  );
}
