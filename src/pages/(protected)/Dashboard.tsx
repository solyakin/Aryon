import { 
  AppSidebar 
} from "@/components/app-sidebar"
import { 
  SidebarInset, 
  SidebarProvider 
} from "@/components/ui/sidebar"
import React from "react"

const ErrorBoundary = React.lazy(() => import("@/components/ErrorBoundary"))
const ComingSoon = React.lazy(() => import("@/components/dashboard/ComingSoon"))

const Dashboard = () => {
  return (
    <ErrorBoundary>
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
              <div className="flex-1 py-4 px-8 bg-gray-100">
                <ComingSoon />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ErrorBoundary>
  )
}

export default Dashboard