/* eslint-disable import/no-anonymous-default-export */
import { AnyAction } from "@reduxjs/toolkit";

import {
    CREATE_POD_PENDING,
    CREATE_POD_SUCCESS,
    CREATE_POD_FAILURE,
    GET_SINGLE_POD_SUCCESS,
} from "../actions/types";
import { Pod } from "./types/commonTypes";

export interface PodsState {
    pods: Pod[];
    getPodsPending: boolean;
    createPodPending: boolean;
    podCreationErrors: any[];
}

const initialState: PodsState = {
    pods: [],
    getPodsPending: false,
    createPodPending: false,
    podCreationErrors: [],
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case CREATE_POD_PENDING:
            return {
                ...state,
                createPodPending: true,
            };
        case CREATE_POD_SUCCESS:
            return {
                ...state,
                createPodPending: false,
                pods: [...state.pods, payload],
                podCreationErrors: [],
            };
        case CREATE_POD_FAILURE:
            return {
                ...state,
                createPodPending: false,
                podCreationErrors: payload,
            };
        case GET_SINGLE_POD_SUCCESS:
            return {
                ...state,
                pods: [
                    ...state.pods.filter((pod) => pod.id !== payload.id),
                    payload,
                ],
            };

        default:
            return state;
    }
};
