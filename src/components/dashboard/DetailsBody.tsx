import type { RecommendationDataProps } from '@/types/global'
import { BookOpen, Box, ChartColumnIncreasing, OctagonAlert, TriangleAlert } from 'lucide-react'

const DetailsBody = ({item}: {item: RecommendationDataProps}) => {
  return (
    <div className="min-h-[calc(100vh-250px)] overflow-y-scroll p-6 flex flex-col gap-6 bg-background">
        <article className="space-y-8">
            <p className="text-card-foreground">
            {item?.description || "No description available for this recommendation."}
            </p>
            <section aria-labelledby="frameworks-title">
            <h3 id="frameworks-title" className="text-sm font-semibold">Compliance Frameworks</h3>
            <div className="flex items-center gap-2 mt-2" role="list">
                {item?.frameworks?.map((framework, index) => (
                <span 
                key={index} 
                role="listitem" 
                className="text-xs px-2 p-0.5 bg-border/95 rounded-md font-semibold">
                    {framework.name}
                </span>
                ))}
            </div>
            </section>
            <section aria-labelledby="resources-title">
            <h3 id="resources-title" className="text-sm font-semibold flex items-center gap-2">
                <Box className="size-5 text-accent-foreground" aria-hidden="true"/>
                Affected Resources
            </h3>
            <ul className="space-y-2 list-disc list-inside pl-4 mt-2" role="list">
                {item?.affectedResources?.map((resource, index) => (
                <li key={index} className="text-xs text-accent-foreground font-semibold max-w-max">
                    {resource.name}
                </li>
                ))}
            </ul>
            </section>
            <section aria-labelledby="reasons-title">
            <h3 id="reasons-title" className="text-sm font-semibold flex items-center gap-2">
                <Box className="size-5 text-accent-foreground" aria-hidden="true"/>
                Implementation Reasons
            </h3>
            <div className="space-y-2 mt-4" role="list">
                {item?.reasons?.map((reason, index) => (
                <p key={index} role="listitem" className="text-xs px-2 p-0.5 bg-border/95 rounded-md font-semibold max-w-max">
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
                    <p className="text-sm text-accent-foreground font-medium">Overall</p>
                    <OctagonAlert size={14} aria-hidden="true"/>
                </div>
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-accent-foreground">Violations</h4>
                    <p className="font-bold text-2xl" aria-label={`${item?.impactAssessment?.totalViolations} violations`}>
                    {item?.impactAssessment?.totalViolations}
                    </p>
                </div>
                </div>
                <div className="border rounded-md shadow-sm p-4 space-y-3" role="status">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-accent-foreground font-medium">Most impact scope</p>
                    <TriangleAlert size={14} aria-hidden="true"/>
                </div>
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-accent-foreground">{item?.impactAssessment?.mostImpactedScope?.type}</h4>
                    <p className="font-bold text-2xl" aria-label={`${item?.impactAssessment?.mostImpactedScope?.count} affected items`}>
                    {item?.impactAssessment?.mostImpactedScope?.count}
                    </p>
                </div>
                </div>
            </div>
            </section>
            <section aria-labelledby="reading-title">
            <h3 id="reading-title" className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-foreground" aria-hidden="true"/>
                Further Reading
            </h3>
            <div className="space-y-2 mt-3">
                {item?.furtherReading?.map((link, index) => (
                <a 
                    key={index}
                    href={link?.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-primary flex items-center gap-1"
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
  )
}

export default DetailsBody