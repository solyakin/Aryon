import * as React from "react"
import {
  BadgeInfo,
  CalendarFold,
  GalleryVerticalEnd,
  LayoutDashboard,
  NotebookText,
  Unlink,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Yair Lad",
    email: "yair@aryon.security",
    avatar: "/avatars/shadcn.jpg",
  },
  company: {
    name: "Aryon Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Recommendations",
      url: "/recommendations",
      icon: Unlink,

    },
    {
      title: "Policies",
      url: "#",
      icon: NotebookText,
    },
    {
      title: "Events",
      url: "#",
      icon: CalendarFold,
    },
    {
      title: "Waivers",
      url: "#",
      icon: BadgeInfo,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
