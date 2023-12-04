import CollectionList from '@/components/CollectionList';

export default function Home() {
  return (
    <>
      <h1 className="uppercase text-3xl font-black text-center mb-6">
        Bookmarks
      </h1>
      <CollectionList />
    </>
  );
}
