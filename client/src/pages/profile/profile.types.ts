import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export type USER_TYPES = {
    id: number;
    name: string;
    profilePic: string;
    email: string;
    username: string;
    website: string | null;
    city: string | null;
    coverPic: string;
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
    username: string;
    email: string;
    name: string;
    city: string;
    website: string;
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
