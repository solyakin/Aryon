import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { VscAzure } from "react-icons/vsc";
import httpRequest from "@/lib/httpsRequest";
import type { RecommendationDataProps } from "@/types/global";
import ErrorBoundary from '../ErrorBoundary';
import { 
  Archive, 
  BookOpen, 
  Box, 
  Boxes, 
  ChartColumnIncreasing, 
  OctagonAlert, 
  TriangleAlert, 
  X 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUserAuthContext } from "@/context/user/user-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { FaAws } from "react-icons/fa";
import { handleErrorMessage } from "@/lib/errorhandler";

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
    <Drawer open={open} onOpenChange={setOpen}>
      <ErrorBoundary>
        <DrawerContent className="sm:w-3xl h-screen ml-auto rounded-none" role="dialog" aria-modal="true" aria-labelledby="recommendation-title">
          <DrawerHeader className="flex flex-row items-center justify-between border-b pb-4">
            <DrawerTitle id="recommendation-title" className="">
              <div className="flex gap-2">
                <div className="bg-teal-600 p-4 rounded-sm" aria-hidden="true">
                  <Boxes className="w-8 h-8 text-white" />
                </div>
                <div className="text-left space-y-1 mt-1.5">
                  <h2 className="text-xl font-semibold">{item?.title}</h2>
                  <div className="flex gap-2 items-center">
                    <h4 className="text-sm font-semibold">Value score</h4>
                    <div 
                      className="flex items-center gap-1" 
                      role="meter" 
                      aria-label="Value score" 
                      aria-valuenow={item?.score || 0} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    >
                      <div className={`w-2.5 h-2.5 ${item?.score >= 25 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
                      <div className={`w-2.5 h-2.5 ${item?.score >= 50 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
                      <div className={`w-2.5 h-2.5 ${item?.score >= 75 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
                      <div className={`w-2.5 h-2.5 ${item?.score >= 100 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
                    </div>
                    <p className="text-xs text-gray-500">({item?.score} / 100)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {item?.title?.toLowerCase().includes('azure') ? (
                  <div className="flex items-center gap-2">
                    <VscAzure className="w-4 h-4 text-gray-600" aria-hidden="true"/>
                    <p className="text-sm text-gray-500">Azure Environment</p>
                  </div>
                ) : item?.title?.toLowerCase().includes('aws') ? (
                  <div className="flex items-center gap-2">
                    <FaAws className="w-4 h-4 text-gray-600" aria-hidden="true"/>
                    <p className="text-sm text-gray-500">AWS Environment</p>
                  </div>
                ) : null}
              </div>
            </DrawerTitle>
            <DrawerClose>
              <button aria-label="Close details">
                <X className="w-5 h-5 text-gray-600 cursor-pointer"/>
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="min-h-[calc(100vh-250px)] overflow-y-scroll p-6 flex flex-col gap-6">
            <article className="space-y-8">
              <p className="text-gray-600">
                {item?.description || "No description available for this recommendation."}
              </p>
              <section aria-labelledby="frameworks-title">
                <h3 id="frameworks-title" className="text-sm font-semibold">Compliance Frameworks</h3>
                <div className="flex items-center gap-2 mt-2" role="list">
                  {item?.frameworks?.map((framework, index) => (
                    <span key={index} role="listitem" className="text-xs text-gray-600 px-2 p-0.5 bg-gray-100 rounded-md font-semibold">
                      {framework.name}
                    </span>
                  ))}
                </div>
              </section>
              <section aria-labelledby="resources-title">
                <h3 id="resources-title" className="text-sm font-semibold flex items-center gap-2">
                  <Box className="size-5 text-gray-700" aria-hidden="true"/>
                  Affected Resources
                </h3>
                <ul className="space-y-2 list-disc list-inside pl-4" role="list">
                  {item?.affectedResources?.map((resource, index) => (
                    <li key={index} className="text-xs text-gray-600 font-semibold max-w-max">
                      {resource.name}
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="reasons-title">
                <h3 id="reasons-title" className="text-sm font-semibold flex items-center gap-2">
                  <Box className="size-5 text-gray-700" aria-hidden="true"/>
                  Implementation Reasons
                </h3>
                <div className="space-y-2" role="list">
                  {item?.reasons?.map((reason, index) => (
                    <p key={index} role="listitem" className="text-xs text-gray-600 px-2 p-0.5 bg-gray-100 rounded-md font-semibold max-w-max">
                      {reason}
                    </p>
                  ))}
                </div>
              </section>
              <section aria-labelledby="impact-title">
                <h3 id="impact-title" className="text-sm font-semibold flex items-center gap-2">
                  <ChartColumnIncreasing className="size-5" aria-hidden="true"/>
                  Impact Assessment
                </h3>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="border rounded-md shadow-sm p-4 space-y-3" role="status">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 font-medium">Overall</p>
                      <OctagonAlert size={14} aria-hidden="true"/>
                    </div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800">Violations</h4>
                      <p className="font-bold text-2xl" aria-label={`${item?.impactAssessment?.totalViolations} violations`}>
                        {item?.impactAssessment?.totalViolations}
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-md shadow-sm p-4 space-y-3" role="status">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 font-medium">Most impact scope</p>
                      <TriangleAlert size={14} aria-hidden="true"/>
                    </div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800">{item?.impactAssessment?.mostImpactedScope?.type}</h4>
                      <p className="font-bold text-2xl" aria-label={`${item?.impactAssessment?.mostImpactedScope?.count} affected items`}>
                        {item?.impactAssessment?.mostImpactedScope?.count}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section aria-labelledby="reading-title">
                <h3 id="reading-title" className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-600" aria-hidden="true"/>
                  Further Reading
                </h3>
                <div className="space-y-2">
                  {item?.furtherReading?.map((link, index) => (
                    <a 
                      key={index}
                      href={link?.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-teal-600 flex items-center gap-1"
                    >
                      {link?.name}
                      <span className="sr-only">(opens in new tab)</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </section>
            </article>
          </div>
          <DrawerFooter>
            <div className="flex justify-end gap-6 w-full border-t pt-4">
              <button 
                onClick={() => {
                  status === 'archived' ? handleUnArchive() : handleArchieve();
                }} 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                aria-label={status === 'archived' ? "Unarchive recommendation" : "Archive recommendation"}
              >
                <Archive className="w-4 h-4" aria-hidden="true"/>
                {status === 'archived' ? "Unarchive" : "Archive"}
              </button>
              <button 
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                aria-label="Configure policy"
              >
                Configure Policy
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </ErrorBoundary>
    </Drawer>
  );
}

export default RecommendationDetails