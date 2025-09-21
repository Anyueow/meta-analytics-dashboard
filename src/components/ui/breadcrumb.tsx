'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home, ArrowLeft } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  showBackButton = true, 
  backHref = '/',
  backLabel = 'Back to Dashboard'
}) => {
  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      {showBackButton && (
        <>
          <Link
            href={backHref}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}
      
      <Link
        href="/"
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.current ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : item.href ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
