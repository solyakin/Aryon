import { createContext, useReducer, type ReactNode } from "react";
import { recommendationsReducer, initialState } from "./recommendations-reducer";
import type { RecommendationsContextType as IRecommendationsContext } from "./types";

export const RecommendationsContext = createContext<IRecommendationsContext>({
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
  },
  dispatch: () => {},
});

RecommendationsContext.displayName = "Recommendations";

interface RecommendationsProviderProps {
  children: ReactNode;
}

export function RecommendationsProvider({ children }: RecommendationsProviderProps) {
  const [state, dispatch] = useReducer(recommendationsReducer, initialState);

  return (
    <RecommendationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecommendationsContext.Provider>
  );
}