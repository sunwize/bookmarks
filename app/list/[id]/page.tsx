import Bookmarks from '@/components/Bookmarks';
import { useSupabase } from '@/lib/composables/useSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { BookmarkList } from '@/types/bookmark';

interface Params {
  id: string
}

export default async function List({ params }: { params: Params }) {
  const supabase = useSupabase();

  const { data: bookmarkList }: PostgrestSingleResponse<BookmarkList> = await supabase
    .from('bookmark_lists')
    .select()
    .eq('id', params.id)
    .limit(1)
    .single();

  return (
    <>
      {
        bookmarkList ? (
          <Bookmarks />
        ) : (
          <p className="text-center">Bookmark list not found.</p>
        )
      }
    </>
  );
}
