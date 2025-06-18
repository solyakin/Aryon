import { Link } from "react-router-dom";
import { Archive, Sparkles } from "lucide-react"

interface DashboardTitleProps {
  title: string;
  subtitle: string;
  link: string;
  actionLabel: string;
}
const DashboardTitle = ({ title, link, actionLabel }: DashboardTitleProps) => {

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">{title}</h1>
       <Sparkles className="size-6 text-teal-600" />
      </div>
      <Link to={link} className="flex items-center gap-2">
        <Archive className="size-4" />
        <span className="text-sm text-gray-600">{actionLabel}</span>
      </Link>
    </div>
  )
}

export default DashboardTitle