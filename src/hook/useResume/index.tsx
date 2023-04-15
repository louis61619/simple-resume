import React, { useContext, useState, useReducer } from "react";
import { example } from "~/constants";
import { type ActionType, type PayloadType, type StateType } from "./type";
import { reducer } from "./reducer";
import { useSession } from "next-auth/react";
import { Alert } from "~/components/alert";
import { newResume, saveResume } from "~/utils/picker";

const initValue = {
  fileId:
    typeof window !== "undefined"
      ? window.localStorage.getItem("fileId") || undefined
      : undefined,
  content: example,
  fileName: "unnamed resume",
};

export const ResumeContext = React.createContext<{
  state: StateType;
  dispatch: React.Dispatch<{
    type: ActionType;
    payload: PayloadType[ActionType];
  }>;
}>({
  state: initValue,
  dispatch: () => {
    return;
  },
});

export function useResume() {
  const { state, dispatch } = useContext(ResumeContext);
  const { data: sessionData } = useSession();
  const { fileId, fileName, content } = state;

  const _saveResume = async () => {
    const accessToken = sessionData?.accessToken;
    if (!accessToken) return Alert.info("with out accessToken");
    if (fileId) {
      const res = await saveResume(
        sessionData.accessToken,
        fileName,
        content,
        fileId
      );
      console.log(res);
    } else {
      if (sessionData?.accessToken) {
        const _fileId = await newResume(
          sessionData.accessToken,
          fileName,
          content
        );
        if (_fileId) {
          dispatch({
            type: "SET_FILE_ID",
            payload: _fileId,
          });
          Alert.info("success");
        } else {
          Alert.info("error");
        }
      }
    }
  };

  return {
    ...state,
    dispatch,
    saveResume: _saveResume,
  };
}

export const ResumeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // const [content, setContent] = useState(example);
  const [state, dispatch] = useReducer(reducer, initValue);

  return (
    <ResumeContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
