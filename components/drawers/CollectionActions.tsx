import Drawer from '@/components/ui/Drawer';
import { BookmarkCollection } from '@/types/bookmark';
import Button from '@/components/ui/Button';
import { FiEdit3, FiLock, FiTrash } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

export type CollectionActionType = 'edit' | 'add-user' | 'delete';

type Props = {
  visible: boolean
  collection: BookmarkCollection
  onHide?: () => void
  onAction: (type: CollectionActionType) => void
}

const ActionButton = (
  { onClick, className, children }:
  { onClick: () => void, className?: string, children: React.ReactNode }
) => (
  <Button
    onClick={onClick}
    className={`w-full flex items-center gap-4 text-left text-xl bg-white/20 text-white font-black py-4 px-6 ${className}`}
  >
    {children}
  </Button>
);

export default function CollectionActions({ visible, onHide, collection, onAction }: Props) {
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(user?.id === collection.user_id || !collection.user_id);
  }, [collection, user]);

  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      <p className="text-3xl font-bold truncate px-2 md:px-3 py-3">{collection.title}</p>
      <hr className="border-white/40"/>
      <div className="grid grid-cols-1 gap-2 px-2 md:px-3 py-3">
        <ActionButton onClick={() => onAction('edit')}>
          <FiEdit3 size={22}/>
          <span>Edit</span>
        </ActionButton>
        <ActionButton onClick={() => onAction('add-user')}>
          <FiLock size={22}/>
          <span>Manage access</span>
        </ActionButton>
      </div>
      {
        isOwner && (
          <>
            <hr className="border-white/40"/>
            <div className="grid grid-cols-1 gap-2 px-2 md:px-3 py-3">
              <ActionButton
                onClick={() => onAction('delete')}
                className="!bg-red-500"
              >
                <FiTrash size={22}/>
                <span>Delete</span>
              </ActionButton>
            </div>
          </>
        )
      }
    </Drawer>
  );
}
