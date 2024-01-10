import Bookmarks from '@/components/Bookmarks';
import AuthWrapper from '@/components/AuthWrapper';

export default function List() {
  return (
    <>
      <AuthWrapper>
        <Bookmarks />
      </AuthWrapper>
    </>
  );
}
