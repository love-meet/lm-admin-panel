import React, { useMemo } from 'react';

const DashboardStats = ({ summary, summaryLoading }) => {
  const stats = useMemo(() => {
    const data = summary?.data || {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0,
      activeUsers: 0,
      maleUsers: 0,
      femaleUsers: 0,
    };

    return [
      {
        title: 'Total Users',
        value: summaryLoading ? 'Loading...' : (data.totalUsers || 0).toLocaleString(),
        gradient: 'from-violet-600 via-purple-600 to-indigo-600',
        icon: '👥',
        iconGradient: 'from-violet-400 to-purple-400',
        change: '+12.5%',
        delay: '0ms',
      },
      {
        title: 'Total Matches Today',
        value: summaryLoading ? 'Loading...' : (data.postsToday || 0).toLocaleString(),
        gradient: 'from-pink-600 via-rose-600 to-red-500',
        icon: '💕',
        iconGradient: 'from-pink-400 to-rose-400',
        change: '+18.2%',
        delay: '100ms',
      },
      {
        title: 'Total Revenue',
        value: summaryLoading ? 'Loading...' : `$${(data.totalRevenue || 0).toLocaleString()}`,
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        icon: '💰',
        iconGradient: 'from-amber-400 to-orange-400',
        change: '+24.7%',
        delay: '200ms',
      },
      {
        title: 'New Sign-ups',
        value: summaryLoading ? 'Loading...' : (data.newSignups || 0).toLocaleString(),
        gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        icon: '✨',
        iconGradient: 'from-emerald-400 to-teal-400',
        change: '+32.1%',
        delay: '300ms',
      },
      {
        title: 'Active Users',
        value: summaryLoading ? 'Loading...' : (data.activeUsers || 0).toLocaleString(),
        gradient: 'from-blue-600 via-indigo-600 to-cyan-600',
        icon: '⚡',
        iconGradient: 'from-blue-400 to-indigo-400',
        change: '+10.4%',
        delay: '350ms',
      },
      {
        title: 'Male Users',
        value: summaryLoading ? 'Loading...' : (data.maleUsers || 0).toLocaleString(),
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        icon: '👨',
        iconGradient: 'from-blue-400 to-indigo-400',
        change: '+15.4%',
        delay: '400ms',
      },
      {
        title: 'Female Users',
        value: summaryLoading ? 'Loading...' : (data.femaleUsers || 0).toLocaleString(),
        gradient: 'from-pink-600 via-rose-600 to-red-600',
        icon: '👩',
        iconGradient: 'from-pink-400 to-rose-400',
        change: '+14.8%',
        delay: '500ms',
      },
    ];
  }, [summary, summaryLoading]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-2">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="group relative animate-pop-in"
          style={{ animationDelay: item.delay }}
        >
          {/* glow behind */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-60 transition duration-500`}
          ></div>

          {/* main card */}
          <div className="relative backdrop-blur-2xl bg-white/10 dark:bg-gray-900/40 rounded-2xl p-6 shadow-xl hover:shadow-3xl transition-all duration-500 border border-white/10 group-hover:scale-105 group-hover:-translate-y-1 cursor-pointer overflow-hidden">

            {/* floating background orbs */}
            <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
              <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl animate-float`}></div>
              <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl animate-float-delayed`}></div>
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              {/* Icon */}
              <div
                className={`relative p-3 rounded-xl bg-gradient-to-br ${item.iconGradient} shadow-xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}
              >
                <span className="text-3xl animate-bounce-subtle">{item.icon}</span>

                {/* shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
              </div>

              {/* change bubble */}
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${item.gradient} text-white text-xs font-bold shadow-lg group-hover:scale-110 transition animate-wiggle`}
              >
                <svg className="w-3 h-3 animate-bounce-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {item.change}
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2 relative z-10">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest group-hover:translate-x-1 transition">
                {item.title}
              </h3>

              <p className={`text-4xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent group-hover:scale-110 transition`}>
                {item.value}
              </p>
            </div>

            {/* bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <div className={`h-full bg-gradient-to-r ${item.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>
            </div>
          </div>

          {/* animations */}
          <style jsx>{`
            @keyframes pop-in {
              0% { opacity: 0; transform: scale(0.5) translateY(30px); }
              50% { transform: scale(1.05) translateY(-5px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }

            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }

            @keyframes float-delayed {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(25px); }
            }

            @keyframes bounce-subtle {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }

            @keyframes shine {
              0% { transform: translateX(-150%) rotate(45deg); }
              100% { transform: translateX(150%) rotate(45deg); }
            }

            @keyframes wiggle {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(3deg); }
            }

            @keyframes bounce-arrow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }

            .animate-pop-in {
              animation: pop-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
            .animate-bounce-subtle { animation: bounce-subtle 2.8s ease-in-out infinite; }
            .animate-shine { animation: shine 1s ease-in-out; }
            .animate-wiggle { animation: wiggle 3s ease-in-out infinite; }
            .animate-bounce-arrow { animation: bounce-arrow 1.2s ease-in-out infinite; }
          `}</style>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
