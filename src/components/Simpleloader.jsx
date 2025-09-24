import React from 'react'

export default function SimpleLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] flex items-center justify-center z-50">
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full text-6xl text-[var(--color-accent-pink)] flex items-center justify-center animate-bounce">
              💖
            </div>
          </div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[var(--color-primary-cyan)] border-r-[var(--color-accent-pink)] rounded-full animate-spin"></div>
          <div
            className="absolute inset-3 border-2 border-transparent border-b-[var(--color-primary-purple)] border-l-[var(--color-accent-yellow)] rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
