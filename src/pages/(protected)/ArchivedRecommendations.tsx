import React from "react"
import { 
  AppSidebar 
} from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { RecommendationsProvider } from "@/context/recommendations/recommendations-context";

const ArchivedRecommendationContent = React.lazy(() => import("@/components/dashboard/ArchivedContent"));

function ArchivedRecommendations() {
  return (
    <div className="h-screen">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1">
          <div className="sticky top-0 z-50 bg-gray-100 lg:hidden p-4">
            <AppSidebar />
          </div>
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          <SidebarInset>
            <RecommendationsProvider>
              <ArchivedRecommendationContent />
            </RecommendationsProvider>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default ArchivedRecommendations;
