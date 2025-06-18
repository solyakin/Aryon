import { userAuthCookieName } from "./user-context";
// import { setClientCookie } from "@/utils";
import { deleteCookie } from "cookies-next";
import type { IUserAuthAction, IUserAuthState } from "./type";
import { setClientCookie } from "@/lib/utils";


export const UserAuthAction ={
    LOG_OUT : "LOG_OUT",
    SET_TOKEN : "SET_TOKEN",
    SET_PAGE_LOADED : "SET_PAGE_LOADED",
    SET_USER :  "SET_USER",
}
export const UserInitialState: IUserAuthState = {
    token: "",
    user: null,
    pageIsLoaded: false,
};

export const UserAuthReducer = (
    state: IUserAuthState,
    action: IUserAuthAction,
) => {
    const { payload } = action;

    switch (action.type) {
        case UserAuthAction.SET_TOKEN:
            // Set cookie
            setClientCookie({
                cookieName: userAuthCookieName,
                cookieValue: payload as string,
                hours: 24,
            });

            return {
                ...state,
                token: action.payload as string,
            };
        case UserAuthAction.SET_PAGE_LOADED:
            return {
                ...state,
                pageIsLoaded: true,
            };
        case UserAuthAction.SET_USER:
            // Set user in local storage
            // localStorage.setItem(
            //     userAuthCookieName,
            //     JSON.stringify(action.payload as any),
            // );

            return {
                ...state,
                user: payload as any,
            };
        case UserAuthAction.LOG_OUT:
            // Remove cookie & local storage data
            // localStorage.removeItem(userAuthCookieName);
            deleteCookie(userAuthCookieName);

            return {
                ...state,
                token: "",
                user: null,
            };
        default:
            return state;
    }
};
