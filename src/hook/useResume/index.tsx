import React, { useContext, useState, useReducer, useEffect } from "react";
import { example } from "~/constants";
import { type ActionType, type PayloadType, type StateType } from "./type";
import { reducer } from "./reducer";
import {
  SessionProvider,
  type SessionProviderProps,
  useSession,
} from "next-auth/react";
import { Alert } from "~/components/alert";
import {
  checkIsPublish,
  getFileConent,
  getFileDescription,
  newResume,
  saveResume,
  publishResume,
  unpublishResume,
  createPicker,
} from "~/utils/picker";
import Script from "next/script";
import { Loading } from "~/components/loading";

const initValue: StateType = {
  fileId:
    typeof window !== "undefined"
      ? window.localStorage.getItem("fileId") || undefined
      : undefined,
  content: example,
  fileName: "unnamed resume",
  isPublish: false,
};

type DispatchType = React.Dispatch<{
  type: keyof PayloadType;
  payload: string | boolean;
}>;

export const ResumeContext = React.createContext<{
  state: StateType;
  dispatch: DispatchType;
}>({
  state: initValue,
  dispatch: () => {
    return;
  },
});

function useGetFileInfo(dispatch: DispatchType) {
  const getFileInfo = async (fileId: string) => {
    if (!fileId) return;
    return await Promise.all([
      getFileDescription(fileId),
      getFileConent(fileId),
    ]).then((res) => {
      // console.log(res);
      const descriptionResult = res[0];
      const contentResult = res[1];
      dispatch({
        type: "SET_FILE_NAME",
        payload: descriptionResult.name || "",
      });
      dispatch({
        type: "SET_IS_PUBLISH",
        payload: checkIsPublish(descriptionResult),
      });
      dispatch({
        type: "SET_CONTENT",
        payload: contentResult,
      });
      return descriptionResult;
    });
  };
  return getFileInfo;
}

export function useResume() {
  const { state, dispatch } = useContext(ResumeContext);
  const { fileId, fileName, content } = state;
  const { data: sessionData } = useSession();
  const getFileInfo = useGetFileInfo(dispatch);

  const _saveResume = async () => {
    if (fileId) {
      try {
        await saveResume(fileName, content, fileId);
        Alert.info("success");
      } catch (error) {
        Alert.info("error");
      }
    } else {
      const _fileId = await newResume(fileName, content);
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
  };

  const _unpublishResume = async () => {
    if (fileId) {
      try {
        const res = await unpublishResume(fileId);
        console.log(res);
        if (res.status === 204) {
          dispatch({
            type: "SET_IS_PUBLISH",
            payload: false,
          });
          Alert.info("success");
        }
      } catch (error) {
        Alert.info("error");
      }
    }
  };

  const openResume = async () => {
    if (!sessionData?.accessToken) return;
    createPicker(sessionData.accessToken, (data) => {
      if (data.action === google.picker.Action.PICKED) {
        const document = data[google.picker.Response.DOCUMENTS][0];
        const fileId = document?.[google.picker.Document.ID];
        // console.log(fileId);
        if (fileId) {
          getFileInfo(fileId);
        }
      }
    });
  };

  const _publishResume = async () => {
    if (fileId) {
      publishResume(fileId).then((res) => {
        console.log(res);
        if (res.status === 200) {
          dispatch({
            type: "SET_IS_PUBLISH",
            payload: true,
          });
          Alert.info("success");
        }
      });
    }
  };

  return {
    ...state,
    dispatch,
    saveResume: _saveResume,
    unpublishResume: _unpublishResume,
    getFileInfo,
    openResume,
    publishResume: _publishResume,
  };
}

export const ResumeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // const [content, setContent] = useState(example);
  const [state, dispatch] = useReducer(reducer, initValue);
  const [gapiInit, setGapiInit] = useState(() => {
    if (typeof window !== "undefined" && window?.gapi && (gapi as any).picker) {
      return true;
    }
    return false;
  });
  const [loading, setLoading] = useState(true);
  const { data: sessionData } = useSession();
  const getFileInfo = useGetFileInfo(dispatch);

  const { fileId } = state;

  function gapiLoaded() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    gapi.load("client:picker", intializePicker);
  }

  async function intializePicker() {
    await gapi.client.load(
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
    );
    setGapiInit(true);
  }

  console.log(state);

  useEffect(() => {
    console.log("load file info");
    if (gapiInit && loading) {
      if (sessionData?.accessToken && fileId) {
        gapi.client.setToken({
          access_token: sessionData.accessToken,
        });
        getFileInfo(fileId).then(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [gapiInit, fileId, loading, sessionData, getFileInfo]);

  return (
    // <SessionProvider session={session} {...props}>
    <ResumeContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {loading ? <Loading /> : children}
      <Script
        async
        defer
        src="https://apis.google.com/js/api.js"
        onLoad={() => {
          gapiLoaded();
        }}
      ></Script>
    </ResumeContext.Provider>
    // </SessionProvider>
  );
};
