import React from 'react';
import { FiEye, FiTrash2, FiHeart, FiMessageCircle, FiImage, FiUser } from 'react-icons/fi';

const PostsTable = ({
  loading,
  paginatedPosts,
  handleView,
  setQuery,
  handleDelete,
  hasPermission,
  formatDate
}) => {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead className="bg-gradient-to-r from-gray-800/80 to-gray-800/60">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  Author
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-block w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading posts...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <tr
                  key={post.id}
                  className="bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-200 group cursor-pointer"
                  onClick={() => handleView(post)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 max-w-md">
                      {post.media && post.media.length > 0 && (
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-700/50 ring-2 ring-gray-700/50 group-hover:ring-violet-500/50 transition-all">
                            {post.media[0] ? (
                              <img 
                                src={post.media[0]} 
                                alt="Post thumbnail" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                onError={(e) => { 
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-700"><svg class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                                }} 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <FiImage className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          {post.media.length > 1 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-800">
                              +{post.media.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-2 leading-relaxed">
                          {post.content || 'No content'}
                        </p>
                        {post.media && post.media.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <FiImage className="w-3 h-3" />
                            <span>{post.media.length} {post.media.length === 1 ? 'image' : 'images'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-violet-500/30">
                        {post.author?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{post.author || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">@{post.author?.toLowerCase().replace(/\s+/g, '') || 'unknown'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400">
                          <FiHeart className="w-3.5 h-3.5" />
                          <span className="text-sm font-semibold">{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400">
                          <FiMessageCircle className="w-3.5 h-3.5" />
                          <span className="text-sm font-semibold">{post.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formatDate(post.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleView(post); }}
                        className="inline-flex items-center gap-2 p-2.5 text-violet-400 hover:text-violet-300 rounded-xl hover:bg-violet-500/20 transition-all duration-300 transform hover:scale-110 group-hover:ring-2 ring-violet-500/30"
                        title="View Details"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      {hasPermission('delete_post') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                          className="inline-flex items-center gap-2 p-2.5 text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110"
                          title="Delete Post"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                      <FiMessageCircle className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium">No posts found</p>
                    <p className="text-sm text-gray-500 mt-1">Posts will appear here once created</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Stats */}
      {!loading && paginatedPosts.length > 0 && (
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-800/40 px-6 py-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Showing <span className="font-semibold text-white">{paginatedPosts.length}</span> posts
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FiHeart className="w-4 h-4 text-pink-400" />
                <span className="text-gray-400">
                  {paginatedPosts.reduce((sum, post) => sum + (post.likes || 0), 0)} Total Likes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">
                  {paginatedPosts.reduce((sum, post) => sum + (post.comments || 0), 0)} Total Comments
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsTable;