import { Link } from "react-router-dom";
import { useTheme } from "@/context/theme/theme-context";
import { Archive, Moon, Sparkles, Sun } from "lucide-react"

interface DashboardTitleProps {
  title: string;
  subtitle: string;
  link: string;
  actionLabel: string;
}

const DashboardTitle = ({ title, subtitle, link, actionLabel }: DashboardTitleProps) => {

  const { theme, toggleTheme } = useTheme()
  return (
    <header className="flex items-center justify-between" role="banner">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-2xl font-medium text-foreground">{title}</h1>
          <Sparkles className="size-4 sm:size-6 text-primary" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 border shadow-md border-accent rounded-full p-2">
        <button onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="mr-2" /> : <Sun className="mr-2" />}
        </button>
        <Link 
          to={link} 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" 
          aria-label={`View ${actionLabel.toLowerCase()}`}
        >
          <Archive className="size-4" aria-hidden="true" />
          <span className="text-sm">{actionLabel}</span>
        </Link>
      </div>
    </header>
  )
}

export default DashboardTitle