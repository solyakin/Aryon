export interface RecommendationDataProps {
  recommendationId: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  category: string;
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}