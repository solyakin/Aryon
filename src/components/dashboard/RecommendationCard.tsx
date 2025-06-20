import { Box } from "lucide-react"
import { VscAzure } from "react-icons/vsc";
import { FaAws } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import RecommendationDetails from "./RecommendationDetails";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { RecommendationDataProps } from "@/types/global";


const ValueScoreIndicator  = React.lazy(() => import("./ValueScoreIndicator"));
interface RecommendationCardProps {
    status: "active" | "archived";
    item: RecommendationDataProps;
}

const RecommendationCard = ({ item, status }: RecommendationCardProps) => {
    const [open, setOpen] = useState(false);
    return (
        <article className="flex flex-col sm:flex-row bg-card text-card-foreground rounded-md transition-colors duration-200">
            <button 
                onClick={() => setOpen(true)}
                aria-label={`View details for ${item?.title}`}
                className={cn(
                    status === "archived" ? "bg-muted-foreground transition-colors" : "bg-primary hover:bg-primary/90 transition-colors",
                    "rounded-t-md sm:rounded-t-none sm:rounded-l-md flex flex-row sm:flex-col justify-center items-center p-4 cursor-pointer w-full md:w-[170px]"
                )}
            >
                <Box className="size-10 text-white sm:mb-2 sm:mx-auto" aria-hidden="true" />
            </button>
            <div className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3">
                    <h2 className="text-lg font-semibold">{item?.title}</h2>
                    <div className="flex items-center gap-4" role="list" aria-label="Cloud providers">
                        <VscAzure className="w-5 h-5 text-muted-foreground" aria-label="Azure" role="img" />
                        <FaAws className="w-5 h-5 text-muted-foreground" aria-label="AWS" role="img" />
                        <FaGoogleDrive className="w-5 h-5 text-muted-foreground" aria-label="Google Cloud" role="img" />
                    </div>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2 sm:line-clamp-none">{item?.description}</p>
                {item?.reasons && item?.reasons?.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2" role="list" aria-label="Framework compliance">
                        {item?.frameworks?.map((framework, index) => (
                            <span 
                                key={index} 
                                role="listitem"
                                className="text-xs text-muted-foreground px-2 p-0.5 bg-accent rounded-md font-semibold"
                            >
                                {framework.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <aside className="bg-accent p-4 rounded-md mx-2 mb-2 sm:my-2 w-full sm:w-auto">
                <div className="text-center border-b border-border pb-3 mb-2 space-y-1">
                    <h3 className="text-sm font-semibold">Impact assessment</h3>
                    <p className="text-sm text-muted-foreground" aria-label={`Approximately ${item?.impactAssessment?.totalViolations} violations per month`}>
                        ~ {item?.impactAssessment?.totalViolations}/ month
                    </p>
                </div>
                <div className="flex gap-2 justify-center items-center mt-4">
                    <h3 className="text-sm font-semibold" id={`value-score-${item?.recommendationId}`}>Value score</h3>
                    <ValueScoreIndicator score={item?.score} recommendationId={item?.recommendationId} />
                </div>
            </aside>
            <RecommendationDetails 
                open={open}
                setOpen={setOpen}
                item={item}
                status={status}
            />
        </article>
    )
}

export default RecommendationCard