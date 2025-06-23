"use client";
import React from "react";

const Navbar = ({ isMobile, isSidebarOpen, toggleSidebar }) => {
  return (
    <nav className="h-[65px] flex justify-between items-center px-3 sm:px-5 md:px-[50px] bg-white border-b border-[#e0e0e0] fixed top-0 left-0 right-0 z-[1000] shadow-md">
      <div className="flex items-center space-x-2">
        {/* Hamburger menu in navbar - only for mobile */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-[#f0f0f0] rounded-md transition focus:outline-none"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#194185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#194185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        )}
          
        <img
          src={isMobile ? "/Group 561.svg" : "/LoomizLogoDarkBlue.svg"}
          alt="Loomiz Logo"
          className="h-[36px] sm:h-[32px] md:h-[38px]"
        />
      </div>
          
      <div className="flex items-center gap-1 sm:gap-3 md:gap-5">
        {/* Removed the !isMobile condition to show the button on all screen sizes */}
        <button
          className="bg-[#EDF5FF] text-[#194185] border border-[#194185] md:border-2 rounded-[8px] md:rounded-[10px] px-2 md:px-4 py-[2px] text-[12px] sm:text-[14px] md:text-[18px] flex items-center gap-1 md:gap-2  hover:bg-[#dceaff] transition duration-200 whitespace-nowrap"
        >
          <span className="text-[16px] md:text-[22px]">+</span>
          <span className="hidden sm:inline">New RFQ</span>
          <span className="inline sm:hidden">New RFQ</span>
        </button>
          
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          {/* Removed 'route' attribute that was causing the error */}
          <img
            src="/NavrbarNotificationLogo.svg"
            alt="Notifications"
            className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] cursor-pointer"
          />
          {!isMobile && (
            <>
              <img
                src="/NavbarProfileLogo.svg"
                alt="User"
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] cursor-pointer"
              />
              <img
                src="/NavbarHelpLogo.svg"
                alt="Help"
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;