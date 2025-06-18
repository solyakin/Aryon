import { type RecommendationsState, type RecommendationsActionType, RecommendationsAction } from './types';

export const initialState: RecommendationsState = {
  availableTags: {
    frameworks: [],
    reasons: [],
    providers: [],
    classes: []
  },
  availableFilters: {
    frameworks: [],
    reasons: [],
    providers: [],
    classes: []
  },
  selectedFilters: {
    frameworks: [],
    reasons: [],
    providers: [],
    classes: []
  }
};

export function recommendationsReducer(
  state: RecommendationsState,
  action: RecommendationsActionType
): RecommendationsState {
  switch (action.type) {
    case RecommendationsAction.SET_AVAILABLE_TAGS:
      return {
        ...state,
        availableTags: action.payload,
      };
    case RecommendationsAction.SET_AVAILABLE_FILTERS:
      return {
        ...state,
        availableFilters: action.payload,
      };
    case RecommendationsAction.UPDATE_SELECTED_FILTERS:
      return {
        ...state,
        selectedFilters: {
          ...state.selectedFilters,
          ...action.payload,
        },
      };
    case RecommendationsAction.CLEAR_FILTERS:
      return {
        ...state,
        selectedFilters: initialState.selectedFilters,
      };
    default:
      return state;
  }
}
