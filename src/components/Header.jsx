import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a
            href="https://github.com/rajofearth/study-notes-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl sm:text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            Study Notes Hub
          </a>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="https://github.com/rajofearth"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full overflow-hidden w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
            >
              <img
                src="https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/my-avatar.png"
                alt="Raj of Earth"
                className="w-full h-full object-cover"
              />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
