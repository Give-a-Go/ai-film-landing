import React from 'react';

interface NavigationProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-transparent pointer-events-none">
      {/* Logo */}
      <a 
        href="https://giveago.co"
        className={`text-2xl font-serif font-medium tracking-tight pointer-events-auto cursor-pointer transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        Give(a)Go
      </a>

      {/* Center Links & Toggle */}
      <div className="hidden md:flex items-center gap-4 bg-white/0 backdrop-blur-[2px] px-6 py-2 rounded-full pointer-events-auto">
        <div className="flex items-center gap-8 mr-4">
          <a 
            href="https://giveago.co"
            className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            About us
          </a>
          <a 
            href="https://luma.com/giveago?period=past"
            className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            Previous events
          </a>
          <a 
            href="https://giveago.co/after-movie/ai-film"
            className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            See outputs from AI Film Making Hackathon v1
          </a>
        </div>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* CTAs */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-1 group ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
          Join waitlist <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
        <a href="https://giveago.co/sponsor" className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'}`}>
          Sponsor
        </a>
      </div>
    </nav>
  );
};

export default Navigation;