import React, { useMemo } from 'react';

const DashboardStats = ({ summary, summaryLoading }) => {
  const stats = useMemo(() => {
    const data = summary.data || {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0
    };

    return [
      {
        title: 'Total Users',
        value: summaryLoading ? 'Loading...' : (data.totalUsers || 0).toLocaleString(),
        gradient: 'from-violet-600 via-purple-600 to-indigo-600',
        glowColor: 'shadow-violet-500/50',
        bgGlow: 'bg-violet-500/10',
        icon: '👥',
        iconGradient: 'from-violet-400 to-purple-400',
        change: '+12.5%',
        delay: '0ms'
      },
      {
        title: 'Total Matches Today',
        value: summaryLoading ? 'Loading...' : (data.postsToday || 0).toLocaleString(),
        gradient: 'from-pink-600 via-rose-600 to-red-500',
        glowColor: 'shadow-pink-500/50',
        bgGlow: 'bg-pink-500/10',
        icon: '💕',
        iconGradient: 'from-pink-400 to-rose-400',
        change: '+18.2%',
        delay: '100ms'
      },
      {
        title: 'Total Revenue',
        value: summaryLoading ? 'Loading...' : `$${(data.totalRevenue || 0).toFixed(2)}`,
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        glowColor: 'shadow-amber-500/50',
        bgGlow: 'bg-amber-500/10',
        icon: '💰',
        iconGradient: 'from-amber-400 to-orange-400',
        change: '+24.7%',
        delay: '200ms'
      },
      {
        title: 'New Sign-ups',
        value: summaryLoading ? 'Loading...' : (data.newSignups || 0).toLocaleString(),
        gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        glowColor: 'shadow-emerald-500/50',
        bgGlow: 'bg-emerald-500/10',
        icon: '✨',
        iconGradient: 'from-emerald-400 to-teal-400',
        change: '+32.1%',
        delay: '300ms'
      },
    ];
  }, [summary, summaryLoading]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="group relative animate-pop-in"
          style={{ animationDelay: item.delay }}
        >
          {/* Pulsing glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 animate-pulse-glow transition duration-500`}></div>
          
          {/* Card */}
          <div className={`relative ${item.bgGlow} backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-transparent hover:border-white group-hover:scale-110 group-hover:-translate-y-2 cursor-pointer overflow-hidden`}>
            
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className={`absolute top-0 -left-4 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl animate-float`}></div>
              <div className={`absolute bottom-0 -right-4 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl animate-float-delayed`}></div>
            </div>

            {/* Floating icon with pop animation */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`relative p-3 rounded-xl bg-gradient-to-br ${item.iconGradient} shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                <span className="text-3xl filter drop-shadow-lg animate-bounce-subtle">{item.icon}</span>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/60 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
              </div>
              
              {/* Animated trend indicator */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${item.gradient} text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 animate-wiggle`}>
                <svg className="w-3 h-3 animate-bounce-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {item.change}
              </div>
            </div>

            {/* Content with slide-up animation */}
            <div className="space-y-2 relative z-10">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest transform group-hover:translate-x-1 transition-transform duration-300">
                {item.title}
              </h3>
              <p className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300 origin-left`}>
                {item.value}
              </p>
            </div>

            {/* Multiple animated accent lines */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${item.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out`}></div>
              <div className={`absolute inset-0 h-full bg-gradient-to-r ${item.gradient} opacity-50 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out delay-100`}></div>
            </div>

            {/* Sparkle effects on hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
          </div>

          <style jsx>{`
            @keyframes pop-in {
              0% {
                opacity: 0;
                transform: scale(0.5) translateY(30px);
              }
              50% {
                transform: scale(1.1) translateY(-10px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            @keyframes pulse-glow {
              0%, 100% {
                opacity: 0.5;
              }
              50% {
                opacity: 0.8;
              }
            }

            @keyframes float {
              0%, 100% {
                transform: translateY(0) translateX(0);
              }
              50% {
                transform: translateY(-20px) translateX(10px);
              }
            }

            @keyframes float-delayed {
              0%, 100% {
                transform: translateY(0) translateX(0);
              }
              50% {
                transform: translateY(20px) translateX(-10px);
              }
            }

            @keyframes bounce-subtle {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-3px);
              }
            }

            @keyframes shine {
              0% {
                transform: translateX(-100%) rotate(45deg);
              }
              100% {
                transform: translateX(200%) rotate(45deg);
              }
            }

            @keyframes wiggle {
              0%, 100% {
                transform: rotate(0deg);
              }
              25% {
                transform: rotate(5deg);
              }
              75% {
                transform: rotate(-5deg);
              }
            }

            @keyframes bounce-arrow {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-2px);
              }
            }

            .animate-pop-in {
              animation: pop-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .animate-pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }

            .animate-float {
              animation: float 6s ease-in-out infinite;
            }

            .animate-float-delayed {
              animation: float-delayed 8s ease-in-out infinite;
            }

            .animate-bounce-subtle {
              animation: bounce-subtle 3s ease-in-out infinite;
            }

            .animate-shine {
              animation: shine 0.8s ease-in-out;
            }

            .animate-wiggle {
              animation: wiggle 2s ease-in-out infinite;
            }

            .animate-bounce-arrow {
              animation: bounce-arrow 1s ease-in-out infinite;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;