import type { Dispatch } from "react";
import type { UserAuthAction } from "./user-reducer";

export interface IUserAuthState {
    user: any | null;
    token: string;
    pageIsLoaded: boolean;
}
// Define the action types as a union of string literals
// export type UserAuthActionEnum = keyof typeof UserAuthAction;
export interface IUserAuthAction {
    type: keyof typeof UserAuthAction;
    payload?:   string | boolean | null;
}

export interface IUserAuthContext {
    token: string;
    user: any;
    pageIsLoaded: boolean;
    dispatch: Dispatch<IUserAuthAction>;
}
