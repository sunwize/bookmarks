'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { DialogsContext } from '@/lib/contexts/DialogsContext';

export default function Shared() {
  const router = useRouter();
  const params = useSearchParams();
  const { setIsCreationDialogVisible } = useContext(DialogsContext);

  const url = params.get('description');

  useEffect(() => {
    if (!url) {
      return router.replace('/');
    }

    setIsCreationDialogVisible(true);
  }, []);

  return (
    <>
      <h1 className="text-center text-xl font-bold">A link has been shared!</h1>
    </>
  );
}
