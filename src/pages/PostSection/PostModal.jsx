import React, { useState } from 'react';
import { FiX, FiHeart, FiMessageCircle, FiCalendar, FiTrash2, FiUser, FiImage, FiMaximize2 } from 'react-icons/fi';

const PostModal = ({ selectedPost, setSelectedPost, setQuery, handleDelete, formatDate }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [fullScreenImage, setFullScreenImage] = useState(null);

  if (!selectedPost) return null;

  const closeModal = () => {
    setSelectedPost(null);
    setQuery('post', null);
  };

  const onDelete = () => {
    handleDelete(selectedPost.id);
    closeModal();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div 
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700/50 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">@{selectedPost.author}</h3>
                <p className="text-xs text-gray-400">{formatDate(selectedPost.date)}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-white rounded-xl p-2 hover:bg-gray-800 transition-all duration-200 transform hover:scale-110 hover:rotate-90"
              aria-label="Close post modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700/50 bg-gray-800/30">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === 'content'
                  ? 'text-white border-b-2 border-violet-500 bg-violet-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'likes'
                  ? 'text-white border-b-2 border-violet-500 bg-violet-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <FiHeart className="w-4 h-4" />
              Likes ({selectedPost.likes || 0})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'text-white border-b-2 border-violet-500 bg-violet-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <FiMessageCircle className="w-4 h-4" />
              Comments ({selectedPost.comments || 0})
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-grow space-y-5 custom-scrollbar">
            {activeTab === 'content' && (
              <>
                {/* Post Text */}
                <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-5 border border-gray-700/50">
                  <p className="text-white whitespace-pre-line leading-relaxed">
                    {selectedPost.content || 'No content available'}
                  </p>
                </div>

                {/* Media Gallery */}
                {selectedPost.media && selectedPost.media.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                      <FiImage className="w-4 h-4" />
                      Media ({selectedPost.media.length})
                    </h4>
                    <div className="rounded-xl overflow-hidden bg-gray-800/30 backdrop-blur-xl border border-gray-700/50">
                      {selectedPost.media.length === 1 ? (
                        <div className="relative w-full flex items-center justify-center bg-black/20 min-h-[300px] max-h-[500px] group">
                          <img 
                            src={selectedPost.media[0]} 
                            alt="Post media" 
                            className="object-contain max-h-[500px] w-full cursor-pointer transition-transform duration-300 group-hover:scale-105" 
                            onClick={() => setFullScreenImage(selectedPost.media[0])}
                            onError={(e) => { 
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="system-ui" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                            }} 
                          />
                          <button
                            onClick={() => setFullScreenImage(selectedPost.media[0])}
                            className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiMaximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className={`grid gap-2 p-2 ${
                          selectedPost.media.length === 2 ? 'grid-cols-2' : 
                          selectedPost.media.length === 3 ? 'grid-cols-3' : 
                          'grid-cols-2'
                        }`}>
                          {selectedPost.media.map((m, i) => (
                            <div 
                              key={i} 
                              className="relative aspect-square rounded-lg overflow-hidden bg-black/20 group cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all"
                              onClick={() => setFullScreenImage(m)}
                            >
                              <img 
                                src={m} 
                                alt={`Post media ${i + 1}`} 
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" 
                                onError={(e) => { 
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="system-ui" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                                }} 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                                <FiMaximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <FiHeart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{selectedPost.likes || 0}</div>
                        <div className="text-xs text-gray-400">Likes</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center border-x border-gray-700/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <FiMessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{selectedPost.comments || 0}</div>
                        <div className="text-xs text-gray-400">Comments</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <FiCalendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{formatDate(selectedPost.date)}</div>
                        <div className="text-xs text-gray-400">Posted</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post ID */}
                {selectedPost.id && (
                  <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
                    <div className="text-xs text-gray-400 mb-1">Post ID</div>
                    <div className="text-sm font-mono text-gray-300">{selectedPost.id}</div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'likes' && (
              <div className="space-y-3">
                {selectedPost.raw?.likes && Array.isArray(selectedPost.raw.likes) && selectedPost.raw.likes.length > 0 ? (
                  selectedPost.raw.likes.map((like, idx) => {
                    const user = typeof like === 'object' ? like.user || like : like;
                    const username = typeof user === 'object' ? user.username || user.name || user.id : user;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:border-violet-500/50 transition-all">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {username ? username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-white font-medium">{username || 'Unknown User'}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                      <FiHeart className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400">No likes yet</p>
                    <p className="text-sm text-gray-500 mt-1">Be the first to like this post</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {selectedPost.raw?.comments && Array.isArray(selectedPost.raw.comments) && selectedPost.raw.comments.length > 0 ? (
                  selectedPost.raw.comments.map((comment, idx) => {
                    const author = comment.author || comment.user || comment.username || 'Unknown';
                    const text = comment.text || comment.content || comment.message || '';
                    const date = comment.createdAt || comment.date || '';
                    return (
                      <div key={idx} className="p-5 bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:border-violet-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {typeof author === 'string' ? author.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{typeof author === 'string' ? author : 'Unknown'}</span>
                              {date && (
                                <span className="text-gray-500 text-xs">• {formatDate(date)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 whitespace-pre-line leading-relaxed pl-13">{text}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                      <FiMessageCircle className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400">No comments yet</p>
                    <p className="text-sm text-gray-500 mt-1">Be the first to comment on this post</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-700/50 flex justify-end gap-3 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <button
              onClick={closeModal}
              className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-xl hover:bg-gray-800 transition-all duration-200 hover:scale-105"
            >
              Close
            </button>
            <button
              onClick={onDelete}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete Post
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fade-in" 
          onClick={() => setFullScreenImage(null)}
        >
          <img 
            src={fullScreenImage} 
            alt="Full screen" 
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-scale-in" 
          />
          <button
            onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}
            className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-xl w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:rotate-90"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </>
  );
};

export default PostModal;