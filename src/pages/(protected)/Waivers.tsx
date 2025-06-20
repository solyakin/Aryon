
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ErrorBoundary = React.lazy(() => import("@/components/ErrorBoundary"));
const ComingSoon = React.lazy(() => import("@/components/dashboard/ComingSoon"));

const Waivers = () => {
  return (
    <ErrorBoundary>
    <div className="h-screen">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1">
          <div className="sticky top-0 z-50 bg-background lg:hidden p-4 transition-colors duration-200">
            <AppSidebar />
          </div>
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          <SidebarInset>
            <div className="flex-1 py-4 px-8 bg-card transition-colors duration-200">
              <ComingSoon />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
    </ErrorBoundary>
  );
};

export default Waivers;