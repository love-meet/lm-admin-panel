import React from 'react';

const PostModal = ({ selectedPost, setSelectedPost, setQuery, handleDelete, formatDate }) => {
  if (!selectedPost) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[var(--color-bg-tertiary)] flex justify-between items-center">
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Post by @{selectedPost.author}</h3>
          <button onClick={() => { setSelectedPost(null); setQuery('post', null); }} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          <p className="text-[var(--color-text-primary)] whitespace-pre-line">{selectedPost.content}</p>
          {selectedPost.media && selectedPost.media.length > 0 && (
            <div className="rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] flex items-center justify-center h-48">
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                {selectedPost.media.length === 1 ? (
                  <img src={selectedPost.media[0]} alt={`post media`} className="object-contain max-h-full max-w-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="grid grid-cols-2 gap-2 p-2 w-full h-full overflow-auto">
                    {selectedPost.media.map((m, i) => (
                      <img key={i} src={m} alt={`post media ${i + 1}`} className="object-cover w-full h-36 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] border-t border-b border-[var(--color-bg-tertiary)] py-3">
            <span>❤️ {selectedPost.likes} likes</span>
            <span>💬 {selectedPost.comments} comments</span>
            <span>📅 {formatDate(selectedPost.date)}</span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[var(--color-bg-tertiary)] flex justify-end gap-3">
          <button onClick={() => { setSelectedPost(null); setQuery('post', null); }} className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]">Close</button>
          <button onClick={() => { handleDelete(selectedPost.id); }} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg">Delete Post</button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;