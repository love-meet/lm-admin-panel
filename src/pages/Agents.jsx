import React from 'react';

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
  const handleAction = (action, agent) => {
    alert(`${action} agent: ${agent.name}`);
  };

  const openCreateAgentModal = () => {
    alert('Create New Agent modal would open here.');
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Deposit Agent Management</h2>
        <button
          onClick={openCreateAgentModal}
          className="bg-[var(--color-primary-purple)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors"
        >
          Create New Agent
        </button>
      </div>
      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Agent ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Telegram
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
            {mockAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{agent.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">{agent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{agent.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href={`https://t.me/${agent.telegramLink.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-cyan)] hover:underline">
                    {agent.telegramLink}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${agent.status === 'Online' ? 'bg-[var(--color-accent-green)] text-white' : 'bg-[var(--color-accent-red)] text-white'
                    }`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{agent.rating}⭐</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleAction('Update', agent)} className="text-[var(--color-accent-yellow)] hover:text-[var(--color-primary-purple)] transition-colors mr-3">
                    Update
                  </button>
                  <button onClick={() => handleAction('Deactivate', agent)} className="text-[var(--color-accent-red)] hover:text-[var(--color-primary-purple)] transition-colors">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}