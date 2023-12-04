import Bookmarks from '@/components/Bookmarks';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Bookmark, BookmarkList } from '@/types/bookmark';

interface Params {
  id: string
}

export default async function List({ params }: { params: Params }) {
  const supabase = useSupabase();

  const { data: bookmarkList }: PostgrestSingleResponse<BookmarkList> = await supabase
    .from('bookmark_list')
    .select()
    .eq('id', params.id)
    .limit(1)
    .single();

  if (!bookmarkList) {
    return (
      <p className="text-center">Bookmark list not found.</p>
    );
  }

  return (
    <>
      <h1 className="text-center text-3xl font-bold mb-6">{bookmarkList.title}</h1>
      <Bookmarks />
    </>
  );
}
