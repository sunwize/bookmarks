'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { DialogsContext } from '@/lib/contexts/DialogsContext';
import { useSharedUrl } from '@/lib/composables/useSharedUrl';

export default function Shared() {
  const router = useRouter();
  const params = useSearchParams();
  const { url: sharedUrl } = useSharedUrl();
  const { setIsCreationDialogVisible, setCreationTab } = useContext(DialogsContext);
  const debug = false;

  useEffect(() => {
    if (!debug && !sharedUrl) {
      return router.replace('/');
    }

    if (!debug) {
      setCreationTab('bookmark');
      setIsCreationDialogVisible(true);
    }
  }, []);

  return (
    <>
      <h1 className="text-center text-xl font-bold">A link has been shared!</h1>
      {
        debug && (
          <ul className="mt-6">
            {
              Array.from(params.entries()).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))
            }
          </ul>
        )
      }
    </>
  );
}
