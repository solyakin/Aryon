import { Link } from "react-router-dom";
import { Archive, Sparkles } from "lucide-react"

interface DashboardTitleProps {
  title: string;
  subtitle: string;
  link: string;
  actionLabel: string;
}

const DashboardTitle = ({ title, subtitle, link, actionLabel }: DashboardTitleProps) => {
  return (
    <header className="flex items-center justify-between" role="banner">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-2xl font-medium">{title}</h1>
          <Sparkles className="size-4 sm:size-6 text-teal-600" aria-hidden="true" />
        </div>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <Link 
        to={link} 
        className="flex items-center gap-2 hover:text-teal-600 transition-colors" 
        aria-label={`View ${actionLabel.toLowerCase()}`}
      >
        <Archive className="size-4" aria-hidden="true" />
        <span className="text-sm text-gray-600">{actionLabel}</span>
      </Link>
    </header>
  )
}

export default DashboardTitle