import type { Dispatch } from "react";

export interface Tag {
  id: string;
  name: string;
}

export interface Filters {
  frameworks: string[];
  reasons: string[];
  providers: string[];
  classes: string[];
}

export interface SelectedFilters {
  frameworks: string[];
  reasons: string[];
  providers: string[];
  classes: string[];
}

export interface RecommendationsState {
  availableTags: Filters;
  availableFilters: Filters;
  selectedFilters: SelectedFilters;
}

export const RecommendationsAction = {
  SET_AVAILABLE_TAGS: 'SET_AVAILABLE_TAGS',
  SET_AVAILABLE_FILTERS: 'SET_AVAILABLE_FILTERS',
  UPDATE_SELECTED_FILTERS: 'UPDATE_SELECTED_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
} as const;

export type RecommendationsActionType = {
  type: keyof typeof RecommendationsAction;
  payload: any;
}

export interface RecommendationsContextType extends RecommendationsState {
  dispatch: Dispatch<RecommendationsActionType>;
}
