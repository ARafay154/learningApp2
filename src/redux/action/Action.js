import { USER } from "./ActionTypes";


export const setUser = (data) => ({
    type: USER,
    payload: data,
});