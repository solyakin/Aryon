import * as React from "react"
import {
  BadgeInfo,
  CalendarFold,
  LayoutDashboard,
  NotebookText,
  Unlink,
  Menu,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import logo from "@/assets/aryonlogo.png"; 

const data = {
  user: {
    name: "Yair Lad",
    email: "yair@aryon.security",
    avatar: "/avatars/shadcn.jpg",
  },
  company: {
    name: "Aryon Inc",
    logo: logo,
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
      url: "/policies",
      icon: NotebookText,
    },
    {
      title: "Events",
      url: "/events",
      icon: CalendarFold,
    },
    {
      title: "Waivers",
      url: "/waivers",
      icon: BadgeInfo,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();

  const sidebarContent = (
    <>
      <SidebarHeader className="border-b">
        <TeamSwitcher company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <div className="block lg:hidden">
        <Sheet>
          <div className="flex items-center justify-between bg-gray-100">
            <div className="flex items-center gap-2">
              <img src={data.company.logo} className="w-10 h-10 object-cover" alt="" />
              <div className="">
                <p className="text-sm font-medium">{data.company.name}</p>
                <p className="text-xs">{data.company.plan}</p>
              </div>
            </div>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-7" />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left" className="w-[300px] p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {sidebarContent}
      <SidebarRail />
    </Sidebar>
  );
}
