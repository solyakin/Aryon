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
        checkCookieForAuthToken();
    }, []);

    const checkCookieForAuthToken = async () => {
        const token = await getCookie(userAuthCookieName);

        if (token) {
            let parseStorageUser = null;
            dispatch({
                type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
                payload: token,
            });

            dispatch({
                type: UserAuthAction.SET_USER as keyof typeof UserAuthAction,
                payload: parseStorageUser,
            });
        } else {
            // localStorage.removeItem(userAuthCookieName);
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
