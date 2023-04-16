import { type ActionType, type PayloadType, type StateType } from "./type";

type ReducerType = <T extends ActionType>(
  state: StateType,
  action: {
    type: T;
    payload: PayloadType[T];
  }
) => StateType;

export const reducer: ReducerType = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_CONTENT":
      return {
        ...state,
        content: payload,
      } as StateType;
    case "SET_FILE_ID":
      return {
        ...state,
        fileId: payload,
      } as StateType;
    case "SET_FILE_NAME":
      return {
        ...state,
        fileName: payload,
      } as StateType;
    case "SET_IS_PUBLISH":
      return {
        ...state,
        isPublish: payload,
      } as StateType;
    default:
      return state;
  }
};
