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
        toast.success("Recommendation archived successfully!");
        await queryClient.invalidateQueries({ queryKey: ['recommendations'] });
        await queryClient.invalidateQueries({ queryKey: ['archived-recommendations'] });
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to archive recommendation.");
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
        toast.success("Recommendation unarchived successfully!");
        await queryClient.invalidateQueries({ queryKey: ['archived-recommendations'] });
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to unarchive recommendation.");
      console.error("Error unarchiving recommendation:", error);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="sm:w-3xl h-screen ml-auto rounded-none">
        <DrawerHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DrawerTitle className="">
            <div className="flex gap-2">
              <div className="bg-teal-600 p-4 rounded-sm">
                <Boxes className="w-8 h-8 text-white" />
              </div>
              <div className="text-left space-y-1 mt-1.5">
                <h2 className="text-xl font-semibold">{item?.title}</h2>
                <div className="flex gap-2 items-center">
                  <h4 className="text-sm font-semibold">Value score</h4>
                  <div className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 ${item?.score >= 25 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`}></div>
                    <div className={`w-2.5 h-2.5 ${item?.score >= 50 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`}></div>
                    <div className={`w-2.5 h-2.5 ${item?.score >= 75 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`}></div>
                    <div className={`w-2.5 h-2.5 ${item?.score >= 100 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`}></div>
                  </div>
                  <p className="text-xs text-gray-500">({item?.score} / 100)</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {item?.title?.toLowerCase().includes('azure') ? (
                <>
                  <VscAzure className="w-4 h-4 text-gray-600"/>
                  <p className="text-sm text-gray-500">Azure Environment</p>
                </>
              ) : item?.title?.toLowerCase().includes('aws') ? (
                <>
                  <FaAws className="w-4 h-4 text-gray-600"/>
                  <p className="text-sm text-gray-500">AWS Environment</p>
                </>
              ) : null}
            </div>
          </DrawerTitle>
          <DrawerClose>
            <X className="w-5 h-5 text-gray-600 cursor-pointer"/>
          </DrawerClose>
        </DrawerHeader>
        <div className="min-h-[calc(100vh-250px)] overflow-y-scroll p-6 flex flex-col gap-6">
          <div className="space-y-8">
            <p className="text-gray-600">
            {item?.description || "No description available for this recommendation."}
            </p>
            <div className="">
              <h4 className="text-sm font-semibold">Compliance Frameworks</h4>
              <div className="flex items-center gap-2 mt-2">
                {
                  item?.frameworks?.length > 0 && item?.frameworks?.map((framework, index) => (
                    <span key={index} className="text-xs text-gray-600 px-2 p-0.5 bg-gray-100 rounded-md font-semibold">
                      {framework.name}
                    </span>
                  ))
                }
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Box className="size-5 text-gray-700"/>
                <p className="font-semibold text-gray-800">Affected Resources</p>
              </div>
              <ul className="space-y-2 list-disc list-inside pl-4">
                {item?.affectedResources && item?.affectedResources?.length > 0 ? (
                  item?.affectedResources?.map((resource, index) => (
                    <li key={index} className="text-xs text-gray-600 font-semibold max-w-max">{resource.name}</li>
                  ))
                ) : (
                  <p className="text-gray-500">No affected resources provided.</p>
                )}
              </ul>
            </div>
            {/* <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Box className="size-5 text-gray-700"/>
                <p className="font-semibold text-gray-800">Resources enforced by policy</p>
              </div>
              <p className="text-xs text-gray-600 px-2 p-0.5 bg-gray-100 rounded-md font-semibold max-w-max">Linux virtual machine</p>
            </div> */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Box className="size-5 text-gray-700"/>
                  <p className="font-semibold text-gray-800">Implementation Reasons</p>
                </div>
                <div className="space-y-2">
                  {item?.reasons && item?.reasons?.length > 0 ? (
                    item?.reasons?.map((reason, index) => (
                      <p key={index} className="text-xs text-gray-600 px-2 p-0.5 bg-gray-100 rounded-md font-semibold max-w-max">{reason}</p>
                    ))
                  ) : (
                    <p className="text-gray-500">No reasons provided.</p>
                  )}
                </div>
            </div>
              <div className="">
                  <div className="flex items-center gap-2">
                      <ChartColumnIncreasing className="size-5"/>
                      <p className="font-semibold text-gray-800">Impact Assessment</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="border rounded-md shadow-sm p-4 space-y-3">
                          <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600 font-medium">Overall</p>
                              <OctagonAlert size={14}/>
                          </div>
                          <div className="flex justify-between items-center">
                              <h4 className="font-bold text-gray-800">Violations</h4>
                              <p className="font-bold text-2xl">{item?.impactAssessment?.totalViolations}</p>
                          </div>
                      </div>
                      <div className="border rounded-md shadow-sm p-4 space-y-3">
                          <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600 font-medium">Most impact scope</p>
                              <TriangleAlert size={14}/>
                          </div>
                          <div className="flex justify-between items-center">
                              <h4 className="font-bold text-gray-800">{item?.impactAssessment?.mostImpactedScope?.type}</h4>
                              <p className="font-bold text-2xl">{item?.impactAssessment?.mostImpactedScope?.count}</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="space-y-5">
                  <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold">Further Reading</h3>
                  </div>
                  {
                    item?.furtherReading?.length > 0 ? 
                    item?.furtherReading?.map((link, index) => (
                      <a 
                      key={index}
                      href={link?.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className=" hover:underline text-teal-600 flex items-center gap-1"
                      >
                      {link?.name}
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                      </a>
                    )) : (
                      <p className="text-gray-500">No further reading available.</p>
                    )
                  }
              </div>
          </div>
        </div>
        <DrawerFooter>
          <div className="flex justify-end gap-6 w-full border-t pt-4">
            <button 
            onClick={() => {
              status === 'archived' ? handleUnArchive() : handleArchieve();
            }} 
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <Archive className="w-4 h-4" />
              {status === 'archived' ? "Unarchive" : "Archive"}
            </button>
            <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
              Configure Policy
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default RecommendationDetails