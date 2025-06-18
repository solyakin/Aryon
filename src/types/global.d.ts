export interface ResponseData {
  data: RecommendationDataProps[]
  pagination: Pagination
  availableTags: AvailableTags
}

export interface RecommendationDataProps {
  tenantId: string
  recommendationId: string
  title: string
  slug: string
  description: string
  score: number
  provider: number[]
  frameworks: Framework[]
  reasons: string[]
  furtherReading: FurtherReading[]
  totalHistoricalViolations: number
  affectedResources: AffectedResource[]
  impactAssessment: ImpactAssessment
  class: number
}

export interface Framework {
  name: string
  section: string
  subsection: string
}

export interface FurtherReading {
  name: string
  href: string
}

export interface AffectedResource {
  name: string
}

export interface ImpactAssessment {
  totalViolations: number
  mostImpactedScope: MostImpactedScope
}

export interface MostImpactedScope {
  name: string
  type: string
  count: number
}

export interface Pagination {
  cursor: Cursor
  totalItems: number
}

export interface Cursor {
  next: any
}

export interface AvailableTags {
  frameworks: string[]
  reasons: string[]
  providers: string[]
  classes: string[]
}
