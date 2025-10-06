import React, { useState } from 'react';
import { FiEdit2, FiUserX, FiPlus } from 'react-icons/fi';
import Modal from '../components/Modal';

const mockAgents = [
  {
    id: 'AGT001',
    name: 'Mike',
    location: 'Lagos',
    telegramLink: '@mikedeposits',
    status: 'Online',
    rating: 4.8,
  },
  {
    id: 'AGT002',
    name: 'Sarah',
    location: 'Abuja',
    telegramLink: '@sarahcrypto',
    status: 'Offline',
    rating: 4.5,
  },
];

export default function Agents() {
  const [agents, setAgents] = useState(mockAgents);
  const [createOpen, setCreateOpen] = useState(false);

  const handleAction = (action, agent) => {
    alert(`${action} agent: ${agent.name}`);
  };

  const openCreateAgentModal = () => {
    setCreateOpen(true);
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Deposit Agent Management
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Manage deposit agents and their details. Add, edit, or deactivate agents.
            </p>
          </div>
          <button
            onClick={openCreateAgentModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white hover:opacity-90"
          >
            <FiPlus className="w-4 h-4" /> Create New Agent
          </button>
        </div>

        {/* Table */}
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
              <thead className="bg-[var(--color-bg-tertiary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Telegram</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
                {agents.length > 0 ? (
                  agents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                        {agent.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                        {agent.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                        {agent.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`https://t.me/${agent.telegramLink.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {agent.telegramLink}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            agent.status === 'Online'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                        {agent.rating} ★
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleAction('Edit', agent)}
                            className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAction('Deactivate', agent)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                            title="Deactivate"
                          >
                            <FiUserX className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                          🤝
                        </div>
                        <p>No agents found. Add a new one to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Agent Modal */}
        <Modal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Create New Agent"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Agent Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Telegram Username
              </label>
              <div className="flex rounded-lg overflow-hidden border border-[var(--color-bg-tertiary)]">
                <span className="inline-flex items-center px-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm">
                  @
                </span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none"
                  placeholder="username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Agent
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
