'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { DialogsContext } from '@/lib/contexts/DialogsContext';

export default function Shared() {
  const router = useRouter();
  const params = useSearchParams();
  const { setIsCreationDialogVisible, setCreationTab } = useContext(DialogsContext);

  const getSharedUrl = () => {
    for (const key of ['title', 'description', 'name', 'text', 'url']) {
      const param = params.get(key);
      if (param?.startsWith('http')) {
        return param;
      }
    }
  };

  useEffect(() => {
    const url = getSharedUrl();
    if (!url) {
      return router.replace('/');
    }

    setCreationTab('bookmark');
    setIsCreationDialogVisible(true);
  }, []);

  return (
    <>
      <h1 className="text-center text-xl font-bold">A link has been shared!</h1>
    </>
  );
}
