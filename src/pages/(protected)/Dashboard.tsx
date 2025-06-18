import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const Dashboard = () => {
  return (
    <div className="h-screen">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 py-4 px-8 bg-gray-100">
              <p>Dashboard Content</p>
            </div>
          </SidebarInset>
          </div>
      </SidebarProvider>
    </div>
  )
}

export default Dashboard