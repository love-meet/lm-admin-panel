import React, { useMemo, useState } from 'react';
import { FiEye, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';

const PostSection = () => {
  // Local state (replace with API integration later)
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all | withMedia | reported
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | mostLiked | mostCommented

  const samplePosts = [
    {
      id: 1,
      content: 'Welcome to the brand new Posts section! 🎉',
      author: 'system',
      likes: 5,
      comments: 0,
      date: new Date().toISOString(),
      media: '',
      reported: false,
    },
    {
      id: 2,
      content: 'Sample post with media preview placeholder.',
      author: 'demo_user',
      likes: 18,
      comments: 3,
      date: new Date(Date.now() - 3600_000).toISOString(),
      media: 'sample.jpg',
      reported: false,
    },
    {
      id: 3,
      content: 'This post has been reported for review.',
      author: 'moderator',
      likes: 2,
      comments: 1,
      date: new Date(Date.now() - 86_400_000).toISOString(),
      media: '',
      reported: true,
    },
  ];

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const filteredPosts = useMemo(() => {
    let data = [...posts];

    // filter
    if (filter === 'withMedia') data = data.filter((p) => !!p.media);
    if (filter === 'reported') data = data.filter((p) => p.reported);

    // search
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (p) => p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      );
    }

    // sort
    switch (sortBy) {
      case 'oldest':
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'mostLiked':
        data.sort((a, b) => b.likes - a.likes);
        break;
      case 'mostCommented':
        data.sort((a, b) => b.comments - a.comments);
        break;
      case 'newest':
      default:
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return data;
  }, [posts, searchTerm, filter, sortBy]);

  const handleView = (post) => setSelectedPost(post);
  const handleDelete = (id) => {
    if (window.confirm('Delete this post?')) setPosts((prev) => prev.filter((p) => p.id !== id));
  };
  const handleSeed = () => setPosts(samplePosts);
  const handleClear = () => setPosts([]);

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Posts</h2>
            <p className="text-[var(--color-text-secondary)]">
              Manage and moderate user posts. Connect this UI to your backend when ready.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSeed}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white hover:opacity-90"
            >
              <FiPlus className="w-4 h-4" /> Seed sample data
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:opacity-90"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-[var(--color-text-muted)]" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Posts</option>
                <option value="reported">Reported</option>
                <option value="withMedia">With Media</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Sort by Newest</option>
                <option value="oldest">Sort by Oldest</option>
                <option value="mostLiked">Most Liked</option>
                <option value="mostCommented">Most Commented</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
              <thead className="bg-[var(--color-bg-tertiary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {post.media && (
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-muted)]">
                              <span className="text-xs">IMG</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-2">
                              {post.content}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--color-text-primary)]">{post.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          <span className="mr-3">❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                        {formatDate(post.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(post)}
                            className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="View Post"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                            title="Delete Post"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">📭</div>
                        <p>No posts to display. Use "Seed sample data" to preview the UI.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--color-bg-tertiary)] flex justify-between items-center">
                <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Post by @{selectedPost.author}</h3>
                <button onClick={() => setSelectedPost(null)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">✕</button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow space-y-4">
                <p className="text-[var(--color-text-primary)] whitespace-pre-line">{selectedPost.content}</p>
                {selectedPost.media && (
                  <div className="rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] flex items-center justify-center h-48">
                    <span className="text-[var(--color-text-muted)]">Media: {selectedPost.media}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] border-t border-b border-[var(--color-bg-tertiary)] py-3">
                  <span>❤️ {selectedPost.likes} likes</span>
                  <span>💬 {selectedPost.comments} comments</span>
                  <span>📅 {formatDate(selectedPost.date)}</span>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[var(--color-bg-tertiary)] flex justify-end gap-3">
                <button onClick={() => setSelectedPost(null)} className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]">Close</button>
                <button onClick={() => { handleDelete(selectedPost.id); setSelectedPost(null); }} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg">Delete Post</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSection;
