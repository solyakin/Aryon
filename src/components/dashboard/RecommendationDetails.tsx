import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import httpRequest from "@/lib/httpsRequest";
import type { RecommendationDataProps } from "@/types/global";
import ErrorBoundary from '../ErrorBoundary';
import { 
  Archive,  
  X 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUserAuthContext } from "@/context/user/user-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { handleErrorMessage } from "@/lib/errorhandler";

const DetailHeader = React.lazy(() => import("./DetailHeader"));
const DetailsBody = React.lazy(() => import("./DetailsBody"));
interface RecommendationDetailsProps {
  open: boolean;
  status: string;
  item: RecommendationDataProps;
  setOpen: (open: boolean) => void;
}

const RecommendationDetails = ({ open, setOpen, item, status }: RecommendationDetailsProps) => {

  const queryClient = useQueryClient();
  const { token } = useUserAuthContext();

  //handle archive action
  const handleArchieve = async () => {
    try {
      const response = await httpRequest({ token: token }).post(
        `/recommendations/${item.recommendationId}/archive`
      );
      if(response.status) {
        toast.success("Recommendation archived successfully!", {
           position: 'top-right',
            style: {
              backgroundColor: '#d4edda',
              color: '#155724',
            }
        });
        await queryClient.invalidateQueries({ queryKey: ['recommendations'] });
        await queryClient.invalidateQueries({ queryKey: ['archived-recommendations'] });
        setOpen(false);
      }
    } catch (error) {
      toast.error(handleErrorMessage(error), {
        position: 'top-right',
        style: {
          backgroundColor: '#f8d7da',
          color: '#721c24',
        }
      });
      console.error("Error archiving recommendation:", error);
    }
  }

  //handle unarchive action
  const handleUnArchive = async () => {
    try {
      const response = await httpRequest({ token: token }).post(
        `/recommendations/${item.recommendationId}/unarchive`
      );
      if(response.status) {
        toast.success("Recommendation archived successfully!", {
           position: 'top-right',
            style: {
              backgroundColor: '#d4edda',
              color: '#155724',
            }
        });
        await queryClient.invalidateQueries({ queryKey: ['archived-recommendations'] });
        setOpen(false);
      }
    } catch (error) {
      toast.error(handleErrorMessage(error), {
        position: 'top-right',
        style: {
          backgroundColor: '#f8d7da',
          color: '#721c24',
        }
      });
      console.error("Error unarchiving recommendation:", error);
    }
  }

  return (
    <ErrorBoundary>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent data-testid="custom-modal" className="sm:w-3xl h-screen ml-auto rounded-none bg-background" role="dialog" aria-modal="true" aria-labelledby="recommendation-title">
          <DrawerHeader className="flex flex-row items-center justify-between bg-background border-b pb-4">
            <DrawerTitle id="recommendation-title" className="">
              <DetailHeader item={item} />
            </DrawerTitle>
            <DrawerClose>
              <button aria-label="Close details">
                <X className="w-5 h-5 text-gray-600 cursor-pointer"/>
              </button>
            </DrawerClose>
          </DrawerHeader>
          <DetailsBody item={item} />
          <DrawerFooter className="bg-background">
            <div className="flex justify-end gap-6 w-full border-t pt-4">
              {
                status === 'archived' ? (
                  <button 
                    onClick={handleUnArchive} 
                    data-testid="unarchive-btn"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-card-foreground hover:bg-gray-100 rounded"
                    aria-label={"Unarchive recommendation"}
                  >
                    <Archive className="w-4 h-4" aria-hidden="true"/>
                    Unarchive
                  </button>
                ) : (
                  <button 
                    onClick={handleArchieve} 
                    data-testid="archive-btn"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-card-foreground hover:bg-gray-100 rounded"
                    aria-label={"Archive recommendation"}
                  >
                    <Archive className="w-4 h-4" aria-hidden="true"/>
                     Archive
                  </button>
                )
              }
              
              <button 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-teal-600"
                aria-label="Configure policy"
              >
                Configure Policy
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </ErrorBoundary>
  );
}

export default RecommendationDetails