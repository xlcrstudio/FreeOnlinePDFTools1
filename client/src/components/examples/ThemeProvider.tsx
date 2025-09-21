import { ThemeProvider } from '../ThemeProvider'

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4 bg-background text-foreground">
        <p>Theme Provider is ready to use</p>
      </div>
    </ThemeProvider>
  )
}