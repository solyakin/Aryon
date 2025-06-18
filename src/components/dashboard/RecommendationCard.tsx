import { Box } from "lucide-react"
import { VscAzure } from "react-icons/vsc";
import { FaAws } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import RecommendationDetails from "./RecommendationDetails";
import { useState } from "react";
import type { RecommendationDataProps } from "@/types/global";

interface RecommendationCardProps {
    status: string;
    item: RecommendationDataProps;
}

const RecommendationCard = ({ item, status }: RecommendationCardProps) => {

    const [open, setOpen] = useState(false);

    const getFrameworkIcon = (frameworkName: string) => {
        switch (frameworkName.toLowerCase()) {
            case 'cis azure':
            case 'azure security benchmark':
                return <VscAzure className="w-5 h-5 text-gray-600" />;
            case 'cis aws foundations':
            case 'gdpr':
                return <FaAws className="w-5 h-5 text-gray-600" />;
            case 'hipaa':
                return <FaGoogleDrive className="w-5 h-5 text-gray-600" />;
            default:
                return null;
        }
    };

  return (
    <div className="flex bg-white rounded-md">
        <div className="bg-teal-500 rounded-tl-md rounded-bl-md flex flex-col justify-center align-center p-4 w-38">
            <Box className="size-6 text-white mb-2 mx-auto" />
        </div>
        <div className="flex-1 p-4 cursor-pointer" onClick={() => setOpen(true)}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{item?.title}</h3>
                <div className="flex items-center gap-4">
                    {
                        item?.frameworks?.map((framework, index) => (
                            <div key={index}>
                                {getFrameworkIcon(framework.name)}
                            </div>
                        ))
                    }
                </div>
            </div>
            <p className="text-sm text-gray-600">{item?.description}</p>
            {item?.reasons && item?.reasons.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                    {item.reasons.map((reason, index) => (
                        <p key={index} className="text-xs text-gray-600 px-2 p-0.5 bg-gray-100 rounded-md font-semibold">{reason}</p>
                    ))}
                </div>
            )}
        </div>
        <div className="bg-gray-100 p-4 rounded-md m-2">
            <div className="text-center border-b border-gray-200 pb-3 mb-2 space-y-1">
                <h4 className="text-sm font-semibold">Impact assessment</h4>
                <p className="text-sm text-gray-600">~ {item?.impactAssessment?.totalViolations}/ month</p>
            </div>
            <div className="flex gap-2 justify-center items-center mt-4">
                <h4 className="text-sm font-semibold">Value score</h4>
                <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-teal-600 rounded-[1.5px]"></div>
                    <div className="w-2.5 h-2.5 bg-teal-600 rounded-[1.5px]"></div>
                    <div className="w-2.5 h-2.5 bg-teal-600 rounded-[1.5px]"></div>
                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-[1.5px]"></div>
                </div>
            </div>
        </div>
        <RecommendationDetails 
            open={open} 
            setOpen={setOpen}
            item={item}
            status={status}
        />
    </div>
  )
}

export default RecommendationCard