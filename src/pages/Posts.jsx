import React from 'react';

const Posts = () => {
  return (
    <div className="p-4 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Post Management</h2>
        <p className="text-[var(--color-text-secondary)]">Manage and moderate user posts</p>
      </div>
    </div>
  );
};

export default Posts;