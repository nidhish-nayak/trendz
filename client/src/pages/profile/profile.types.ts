import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export type USER_TYPES = {
    id: number;
    name: string;
    email: string;
    username: string;
    city: string | null;
    website: string | null;
    coverPic: string | null;
    profilePic: string | null;
};

export type FOLLOW_TYPE = {
    id: number;
    followerUserId: number;
    followedUserId: number;
};

export type FOLLOW_MUTATION_TYPE = {
    followerUserId: number;
    followedUserId: number;
};

export type EDIT_PROFILE_FORM_TYPE = {
    id: number;
    username: string;
    email: string;
    name: string;
    city: string | null;
    website: string | null;
    coverPic: string | null;
    profilePic: string | null;
};

export type MUTATION_TYPE = UseMutationResult<
    AxiosResponse,
    AxiosError,
    EDIT_PROFILE_FORM_TYPE,
    unknown
>;

export type UPLOAD_IMAGE_PROPS_TYPE = {
    profilePic: string;
    coverPic: string;
};
