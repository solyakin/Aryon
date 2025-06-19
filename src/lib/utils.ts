import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { setCookie } from "cookies-next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CookieOptionProps {
    path?: string;
    secure: boolean;
    expires: Date;
    httpOnly?: boolean;
    domain?: string;
    sameSite: boolean | "none" | "lax" | "strict";
}

type SetCookieProps = {
    cookieName: string;
    cookieValue: string;
    hours: number;
};

export let cookieOptions = {
    secure: true,
    sameSite: true,
} as CookieOptionProps;

export const setClientCookie = ({
    cookieName,
    cookieValue,
    hours,
}: SetCookieProps) => {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + hours * 60 * 60 * 1000);

    const isDev = process.env.NODE_ENV === "development";

    cookieOptions = {
        ...cookieOptions,
        expires: expiryDate,
    };

    if (isDev) {
        cookieOptions = {
            ...cookieOptions,
            sameSite: "lax",
            secure: false,
            httpOnly: false,
        };
    }
    setCookie(cookieName, cookieValue, cookieOptions);
};