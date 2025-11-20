import React from 'react';
import { FiEye, FiSlash, FiTrash2, FiLock, FiCheck, FiMoreVertical, FiUser, FiCopy } from 'react-icons/fi';

const UsersTable = ({
  paginatedUsers,
  openMenuId,
  setOpenMenuId,
  handleView,
  setConfirm,
  verifyUser,
  unverifyUserHandler,
  enableUser,
  actionLoading,
  hasPermission,
  truncateMiddle,
  truncateRight,
  copyId,
  currentPage,
  setCurrentPage,
  totalPages
}) => {
  React.useEffect(() => {
    // Inject pop-in keyframes if not already present
    if (!document.getElementById('users-table-popin')) {
      const s = document.createElement('style');
      s.id = 'users-table-popin';
      s.textContent = `@keyframes pop-in { 0% { opacity: 0; transform: scale(0.96) translateY(10px); } 50% { transform: scale(1.02) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }`;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div className="relative overflow-visible">
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-t-2xl p-4 shadow-2xl border border-gray-700/50 overflow-visible">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead className="bg-gradient-to-r from-gray-800/80 to-gray-800/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Date Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {paginatedUsers.map((user, idx) => (
              <tr
                key={user.id}
                className="bg-gray-800/40 hover:bg-gray-800/60 transition-colors cursor-pointer"
                onClick={() => handleView(user)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleView(user); } }}
                style={{ animation: `pop-in 420ms cubic-bezier(0.68, -0.55, 0.265, 1.55) both`, animationDelay: `${idx * 60}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center gap-2">
                    <div className="font-mono">{truncateMiddle(user.id)}</div>
                    <button onClick={() => copyId(user.id)} title="Copy ID" className="p-1 rounded hover:bg-gray-700/50">
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.profilePic ? (
                      <img className="h-10 w-10 rounded-full object-cover" src={user.profilePic} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400">
                        <div className="p-1 rounded-full bg-gradient-to-br from-red-400 to-red-400 text-white">
                          <FiUser className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                    <div className="ml-4 text-sm font-medium text-white flex items-center gap-2">
                      <span>{truncateRight(user.username || user.fullName)}</span>
                      {user.verified && (
                        <span title="Verified" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white">
                          <FiCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {user.email ? `${user.email.split('@')[0].substring(0, 3)}...@${user.email.split('@')[1]}` : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                    user.subscriptionPlan === 'Free' ? 'bg-red-400 text-white' :
                    'bg-gradient-to-r from-emerald-500 to-teal-400 text-white'
                  }`}>
                    {user.subscriptionPlan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isDisabled ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-600 text-white shadow-sm">
                      Suspended
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600 text-white shadow-sm">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.dateJoined}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative z-40">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}
                      className="p-1 rounded-full hover:bg-gray-700/50 transition-all duration-200 transform hover:scale-110"
                    >
                      <FiMoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {openMenuId === user.id && (
                      <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleView(user); setOpenMenuId(null); }}
                          className="flex w-full text-left px-4 py-3 text-gray-200 bg-transparent border-none border-b border-gray-600 cursor-pointer items-center gap-2 transition-colors hover:bg-gray-700 disabled:opacity-50"
                          disabled={actionLoading}
                        >
                          <FiEye className="w-4 h-4 text-blue-400" /> View Profile
                        </button>
                        {!user.isDisabled ? (
                          <>
                            {hasPermission('users_edit') && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirm({ type: 'suspend', user }); setOpenMenuId(null); }}
                                className="flex w-full text-left px-4 py-3 text-gray-200 bg-transparent border-none border-b border-gray-600 cursor-pointer items-center gap-2 transition-colors hover:bg-gray-700 disabled:opacity-50"
                                disabled={actionLoading}
                              >
                                <FiSlash className="w-4 h-4 text-amber-400" /> Suspend User
                              </button>
                            )}
                            {hasPermission('verify_users') && (
                              <button
                                onClick={(e) => { e.stopPropagation(); verifyUser(user); setOpenMenuId(null); }}
                                className="flex w-full text-left px-4 py-3 text-gray-200 bg-transparent border-none border-b border-gray-600 cursor-pointer items-center gap-2 transition-colors hover:bg-gray-700 disabled:opacity-50"
                                disabled={actionLoading}
                              >
                                <FiCheck className="w-4 h-4 text-green-400" /> Verify User
                              </button>
                            )}
                            {hasPermission('disable_users') && (
                              <button
                                onClick={(e) => { e.stopPropagation(); unverifyUserHandler(user); setOpenMenuId(null); }}
                                className="flex w-full text-left px-4 py-3 text-gray-200 bg-transparent border-none border-b border-gray-600 cursor-pointer items-center gap-2 transition-colors hover:bg-gray-700 disabled:opacity-50"
                                disabled={actionLoading}
                              >
                                <FiLock className="w-4 h-4 text-yellow-400" /> Unverify User
                              </button>
                            )}
                          </>
                        ) : (
                          hasPermission('enable_users') && (
                            <button
                              onClick={(e) => { e.stopPropagation(); enableUser(user); setOpenMenuId(null); }}
                              className="flex w-full text-left px-4 py-3 text-white bg-gray-800 border-none border-b border-gray-600 cursor-pointer items-center gap-2 transition-all duration-200 hover:bg-gray-700 hover:pl-5 disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <FiLock className="w-4 h-4 text-green-400" /> Enable User
                            </button>
                          )
                        )}
                        {hasPermission('users_delete') && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirm({ type: 'delete', user }); setOpenMenuId(null); }}
                            className="flex w-full text-left px-4 py-3 text-red-400 bg-transparent border-none cursor-pointer items-center gap-2 transition-colors hover:bg-red-900/20 disabled:opacity-50"
                            disabled={actionLoading}
                          >
                            <FiTrash2 className="w-4 h-4" /> Delete User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-b-2xl p-4 border-t border-gray-700/50 flex justify-between items-center">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(Number(p) - 1, 1))}
              className="px-3 py-1 rounded-md bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
              aria-label="Previous page"
            >
              Previous
            </button>

            <span className="text-sm text-[var(--color-text-primary)]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(Number(p) + 1, totalPages))}
              className="px-3 py-1 rounded-md bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;