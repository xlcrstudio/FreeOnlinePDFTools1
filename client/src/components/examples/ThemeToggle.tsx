import { ThemeProvider } from '../ThemeProvider'
import { ThemeToggle } from '../ThemeToggle'

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 bg-background">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}