import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

export function Breadcrumb({ items }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex flex-wrap items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
            )}
            {item.onClick ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  item.onClick();
                }}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                {isMobile ? truncateText(item.label, 15) : item.label}
              </button>
            ) : (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                {isMobile ? truncateText(item.label, 15) : item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
