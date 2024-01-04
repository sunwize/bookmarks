import Bookmarks from '@/components/Bookmarks';
import AuthWrapper from '@/components/AuthWrapper';

export default async function List() {
  return (
    <>
      <AuthWrapper>
        <Bookmarks />
      </AuthWrapper>
    </>
  );
}
