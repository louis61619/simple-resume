export type StateType = {
  fileId?: string;
  content: string;
  fileName: string;
  isPublish: boolean;
};

export type PayloadType = {
  SET_CONTENT: string;
  SET_FILE_ID: string;
  SET_FILE_NAME: string;
  SET_IS_PUBLISH: boolean;
};

export type ActionType = keyof PayloadType;
