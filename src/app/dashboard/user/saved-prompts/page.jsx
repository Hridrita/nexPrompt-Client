import { getBookmarkedPromptByUser } from '@/lib/api/bookmark';
import { getUserSession } from '@/lib/core/session';
import BookmarkCard from './BookmarkCard';
import { Library } from 'lucide-react';

const SavedPromptsPage = async () => {
  const user = await getUserSession();
  const bookmarks = await getBookmarkedPromptByUser(user.id);

  return (
    <div className="min-h-screen bg-[#EEF4F8] rounded-2xl px-4 sm:px-8 py-8 max-w-5xl mx-auto">

      
      <div className="bg-[#115a88] rounded-xl px-6 py-5 flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-[#7FB3D3] font-semibold">
           <span className='flex gap-1 items-center'> <Library /> Library</span> 
          </span>
          <h1 className="text-[22px] font-bold text-white leading-tight">Saved prompts</h1>
          <p className="text-sm text-[#A8C8DF]">Your personal collection of bookmarked prompts</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#163F5C] border border-[#2A6690] rounded-xl px-5 py-3 min-w-[64px]">
          <span className="text-2xl font-bold text-white leading-none">{bookmarks.length}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#7FB3D3] mt-0.5">saved</span>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((item) => (
            <BookmarkCard key={item._id} title={item.promptTitle} promptID={item.promptId} userId={user.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#D6EAF8] text-[#1B4F72] text-2xl">🔖</div>
          <h3 className="text-base font-semibold text-[#1A2F3F]">Nothing saved yet</h3>
          <p className="text-sm text-[#5D7A8A] max-w-xs">Browse prompts and bookmark the ones you want to revisit.</p>
        </div>
      )}
    </div>
  );
};

export default SavedPromptsPage;