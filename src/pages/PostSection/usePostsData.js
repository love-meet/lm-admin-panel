import { useEffect, useMemo, useState } from 'react';
import adminApi from '../../api/admin';
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

const usePostsData = () => {
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

  const handleClear = () => setPosts([]);

  return {
    posts,
    selectedPost,
    setSelectedPost,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    loading,
    actionLoading,
    currentPage,
    setCurrentPage,
    filteredPosts,
    paginatedPosts,
    totalPages,
    formatDate,
    handleView,
    handleDelete,
    handleModerate,
    handleClear,
    setQuery
  };
};

export default usePostsData;