import { Archive } from "lucide-react"
import { Link } from "react-router-dom";

interface DashboardTitleProps {
  title: string;
  subtitle: string;
  link: string;
  actionLabel: string;
}
const DashboardTitle = ({ title, subtitle, link, actionLabel }: DashboardTitleProps) => {

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-medium">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
        <Link to={link} className="flex items-center gap-2">
          <Archive className="size-4" />
          <span className="text-sm text-gray-600">{actionLabel}</span>
        </Link>
    </div>
  )
}

export default DashboardTitle