export type StateType = {
  fileId?: string;
  content: string;
  fileName: string;
};

export type PayloadType = {
  SET_CONTENT: string;
  SET_FILE_ID: string;
  SET_FILE_NAME: string;
};

export type ActionType = keyof PayloadType;

