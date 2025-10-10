import React, { useEffect, useMemo, useState } from 'react';
import { FiEye, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';
import adminApi from '../api/admin';
import { toast } from 'sonner';

// Helper to read URL params
const readQuery = (key) => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  } catch (e) {
    return null;
  }
};

// Helper to set URL params
const setQuery = (key, value) => {
  try {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
  } catch (e) {
    // ignore
  }
};

const PostSection = () => {
  
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all | withMedia | reported
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | mostLiked | mostCommented
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  

  const mapPost = (t) => {
    // normalize media into an array of usable URL strings (or empty array)
    const normalizeMedia = (m) => {
      if (!m) return [];
      // string -> single url
      if (typeof m === 'string') return [m];
      // array -> map items to url or string fallback
      if (Array.isArray(m)) {
        return m
          .map((it) => {
            if (!it) return null;
            if (typeof it === 'string') return it;
            // common cloudinary / upload fields
            return it.url || it.secure_url || it.path || it.src || it.public_url || null;
          })
          .filter(Boolean);
      }
      // object -> try to extract url-like fields
      if (typeof m === 'object') return [m.url || m.secure_url || m.path || m.src || ''].filter(Boolean);
      return [];
    };

    return {
      id: t._id || t.id || t.postId || '',
      content: t.content || t.text || t.body || '',
      // author can be a string or an object; prefer username/name/userId when object
      author: (() => {
        const candidate = t.author ?? t.user ?? t.authorName ?? t.username;
        if (!candidate) return (t.userEmail ? t.userEmail.split('@')[0] : 'unknown');
        if (typeof candidate === 'string') return candidate;
        // object -> try common fields
        return candidate.username || candidate.name || candidate.userId || candidate.id || 'unknown';
      })(),
      likes: Number(t.likes ?? t.likeCount ?? t.reactions ?? 0) || 0,
      comments: Number(t.comments ?? t.commentCount ?? 0) || 0,
      date: t.createdAt || t.date || t.timestamp || new Date().toISOString(),
      media: normalizeMedia(t.media ?? t.image ?? t.images ?? t.thumbnail ?? ''),
      reported: Boolean(t.reported || t.isReported || (t.reports && t.reports.length)),
      raw: t,
    };
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAllPosts();
        console.log('[posts] getAllPosts raw', res);
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        const mappedPosts = list.map(mapPost);
        setPosts(mappedPosts);

        // Check for URL param to restore modal state
        const postId = readQuery('post');
        if (postId) {
          const post = mappedPosts.find(p => p.id === postId);
          if (post) {
            handleView(post);
          }
        }
      } catch (err) {
        console.error('[posts] load error', err);
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleView = async (post) => {
    setActionLoading(true);
    try {
      // fetch full post details
      const res = await adminApi.getPostById(post.id);
      console.log('[posts] getPostById raw', res);
      let detail = res;
      if (res?.data) detail = res.data;
      if (res?.data?.data) detail = res.data.data;
      setSelectedPost(mapPost(detail || post));
    } catch (err) {
      console.error('[posts] view error', err);
      toast.error('Failed to load post');
      setSelectedPost(post);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    setActionLoading(true);
    try {
      await adminApi.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Post deleted');
      setSelectedPost(null);
      setQuery('post', null);
    } catch (err) {
      console.error('[posts] delete error', err);
      toast.error('Failed to delete post');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClear = () => setPosts([]);

  

  const handleModerate = async (id, action) => {
    // action: 'approve' | 'reject' | custom
    setActionLoading(true);
    try {
      await adminApi.moderatePost(id, { action });
      toast.success('Post moderation updated');
      // refresh list
      const res = await adminApi.getAllPosts();
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;
      setPosts(list.map(mapPost));
      setSelectedPost(null);
      setQuery('post', null);
    } catch (err) {
      console.error('[posts] moderate error', err);
      toast.error('Failed to moderate post');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Posts</h2>
            
          </div>
          <div className="flex gap-2">
      
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[var(--color-text-secondary)]">Loading posts...</td>
                  </tr>
                ) : paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer" onClick={() => handleView(post)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {post.media && post.media.length > 0 && (
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-muted)]">
                              {/* show small thumbnail if we have a url */}
                              {post.media[0] ? (
                                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                <img src={post.media[0]} alt="post thumbnail" className="h-10 w-10 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                              ) : (
                                <span className="text-xs">IMG</span>
                              )}
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
                            onClick={(e) => { e.stopPropagation(); handleView(post); setQuery('post', post.id); }}
                            className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="View Post"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
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
                        <p>No posts to display.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 flex justify-between items-center border-t border-[var(--color-bg-tertiary)]">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--color-text-primary)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* View Modal */}
        {selectedPost && (
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
        )}
      </div>
    </div>
  );
};

export default PostSection;
