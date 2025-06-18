"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const isActive = location.pathname.includes(item.url);
          return (
            <SidebarMenuButton 
              key={index} 
              onClick={() => navigate(item.url)} 
              tooltip={item.title} 
              className={cn(
                "cursor-pointer transition-colors",
                isActive && "bg-teal-100 text-teal-600 hover:bg-teal-200"
              )}
            >
              {item.icon && <item.icon className={cn(isActive && "text-teal-600")} />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
