import { type ActionType, type PayloadType, type StateType } from "./type";

export const reducer = (
  state: StateType,
  action: {
    type: ActionType;
    payload: PayloadType[ActionType];
  }
) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_CONTENT":
      return {
        ...state,
        content: payload,
      };
    case "SET_FILE_ID":
      return {
        ...state,
        fileId: payload,
      };
    case "SET_FILE_NAME":
      return {
        ...state,
        fileName: payload,
      };
    default:
      return state;
  }
};
