import { createContext, useEffect, useReducer, type ReactNode } from "react";
import { getCookie } from "cookies-next";
import { type IUserAuthContext } from "./type";
import { UserAuthAction, UserAuthReducer, UserInitialState } from "./user-reducer";

export const UserAuthContext = createContext<IUserAuthContext>({
    token: "",
    user: null,
    pageIsLoaded: false,
    dispatch: () => {},
});

export const userAuthCookieName = "userAuthCookieName";

interface IAuthProvider {
    children: ReactNode;
}

UserAuthContext.displayName = "UserAuth";

export function UserAuthContextProvider({ children }: IAuthProvider) {
    const [state, dispatch] = useReducer(UserAuthReducer, UserInitialState);

    useEffect(() => {
        // Execute on initial load
        checkAuthToken();
    }, []);

    const checkAuthToken = async () => {
        // Check localStorage first
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
            dispatch({
                type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
                payload: storedToken,
            });
        } else {
            // Fallback to cookie if no localStorage token
            const cookieToken = await getCookie(userAuthCookieName);
            if (cookieToken) {
                // Save to localStorage for persistence
                localStorage.setItem('authToken', cookieToken.toString());
                dispatch({
                    type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
                    payload: cookieToken,
                });
            }
        }

        dispatch({
            type: UserAuthAction.SET_PAGE_LOADED as keyof typeof UserAuthAction,
        });
    };

    return (
         // @ts-ignore 
        <UserAuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserAuthContext.Provider>
    );
}
