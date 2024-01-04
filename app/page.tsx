import CollectionList from '@/components/CollectionList';
import AuthWrapper from '@/components/AuthWrapper';

export default function Home() {
  return (
    <>
      <AuthWrapper>
        <CollectionList />
      </AuthWrapper>
    </>
  );
}
