import React, { useContext, useEffect } from "react";
import {
  useSession,
  getCsrfToken,
  getProviders,
  signOut,
} from "next-auth/react";
import { Button } from "./button";
import { useResume } from "~/hook/useResume";

type ToolProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  openSignInDialog: () => void;
};

type ButtonProps = React.ComponentProps<typeof Button>;
type AuthButtonProps = ButtonProps;
const ToolsContext = React.createContext<{
  openSignInDialog: (() => void) | null;
}>({
  openSignInDialog: null,
});

const AuthButton: React.FC<AuthButtonProps> = ({ onClick, ...props }) => {
  const { data: sessionData } = useSession();
  const { openSignInDialog } = useContext(ToolsContext);

  return (
    <Button
      {...(sessionData?.user
        ? {
            onClick,
          }
        : {
            onClick: () => openSignInDialog?.(),
          })}
      {...props}
    ></Button>
  );
};

const Tools: React.FC<ToolProps> = ({ openSignInDialog, ...props }) => {
  const { data: sessionData } = useSession();
  const { fileId, content, fileName, dispatch, saveResume } = useResume();

  useEffect(() => {
    if (sessionData?.error === "RefreshAccessTokenError") {
      // Force sign in to hopefully resolve error
      openSignInDialog();
    }
  }, [sessionData, openSignInDialog]);

  return (
    <ToolsContext.Provider
      value={{
        openSignInDialog,
      }}
    >
      <div {...props}>
        {/* <Button className="h-8 w-7 bg-black">fjeiwofjw</Button> */}
        <span className="mr-auto">
          <input
            type="text"
            placeholder="resume name"
            className="border-b border-gray-200 outline-none"
            value={fileName}
            onChange={(e) => {
              dispatch({
                type: "SET_FILE_NAME",
                payload: e.target.value,
              });
            }}
          />
        </span>

        <Button>print</Button>
        <AuthButton onClick={() => saveResume()}>save</AuthButton>
        <AuthButton onClick={() => {}}>publish</AuthButton>
        <AuthButton>get public url</AuthButton>
        <AuthButton>open resume</AuthButton>
        <AuthButton>new resume</AuthButton>
        {sessionData?.user && (
          <Button onClick={() => signOut()}>sign out</Button>
        )}
      </div>
    </ToolsContext.Provider>
  );
};

export { Tools };
