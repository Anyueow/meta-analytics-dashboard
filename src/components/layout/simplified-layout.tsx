'use client'

import React, { useState } from 'react'
import Navbar from './navbar'
import AISidebar from './ai-sidebar'

interface SimplifiedLayoutProps {
  children: React.ReactNode
}

const SimplifiedLayout: React.FC<SimplifiedLayoutProps> = ({ children }) => {
  const [isAISidebarCollapsed, setIsAISidebarCollapsed] = useState(true) // Start collapsed to reduce clutter

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {/* AI Sidebar - Right side, collapsible */}
        <AISidebar
          isCollapsed={isAISidebarCollapsed}
          onToggle={() => setIsAISidebarCollapsed(!isAISidebarCollapsed)}
        />
      </div>
    </div>
  )
}

export default SimplifiedLayout