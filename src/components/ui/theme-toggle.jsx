import { Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useState, useRef, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
        {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
        {theme === 'system' && <Laptop className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-background border border-border">
          <div className="py-1">
            {themeOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-muted ${
                    theme === option.value ? 'bg-muted' : ''
                  }`}
                  onClick={() => {
                    setTheme(option.value)
                    setShowDropdown(false)
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
