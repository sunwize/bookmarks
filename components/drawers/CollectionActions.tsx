import Drawer from '@/components/ui/Drawer';
import { BookmarkCollection } from '@/types/bookmark';
import Button from '@/components/ui/Button';
import { FiEdit3, FiUserPlus } from 'react-icons/fi';

export type CollectionActionType = 'edit' | 'add-user';

type Props = {
  visible: boolean
  collection: BookmarkCollection
  onHide?: () => void
  onAction: (type: CollectionActionType) => void
}

const ActionButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
  <Button
    onClick={onClick}
    className="w-full flex items-center gap-4 text-left text-xl bg-white/20 text-white font-black py-4 px-6"
  >
    {children}
  </Button>
);

export default function CollectionActions({ visible, onHide, collection, onAction }: Props) {
  return (
    <Drawer
      visible={visible}
      onHide={onHide}
    >
      <p className="text-3xl font-bold truncate pt-3 px-2">{collection.title}</p>
      <hr className="border-white/40 my-3"/>
      <div className="grid grid-cols-1 gap-2 px-2 pb-3">
        <ActionButton onClick={() => onAction('edit')}>
          <FiEdit3 size={22} />
          <span>Edit</span>
        </ActionButton>
        <ActionButton onClick={() => onAction('add-user')}>
          <FiUserPlus size={22} />
          <span>Share with someone</span>
        </ActionButton>
      </div>
    </Drawer>
  );
}
