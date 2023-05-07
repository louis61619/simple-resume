import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import {
  signIn,
  signOut,
  useSession,
  getCsrfToken,
  getProviders,
} from "next-auth/react";

import { api } from "~/utils/api";
import { Dialog } from "~/components/dialog";
import { useEffect, useState } from "react";
import { getToken } from "next-auth/jwt";
import { Button } from "~/components/button";
import { Editor } from "~/components/editor";
import { Tools } from "~/components/tools";
import { createPicker } from "~/utils/picker";
import { ResumeContextProvider } from "~/hook/useResume";

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<PageProps> = ({ providers }) => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <>
      <Head>
        <title>simple resume</title>
        <meta name="description" content="create resume by markdown" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col p-3">
        <Tools
          openSignInDialog={() => setShowAuthDialog(true)}
          className="mb-1 flex"
        />
        <Editor className="flex flex-1" />
      </main>
      <Dialog
        open={showAuthDialog}
        onClose={() => {
          setShowAuthDialog(false);
        }}
      >
        <div className="h-full text-center">
          <p className="text-2xl text-gray-500">Authorization required</p>
          <p className="p-4 text-base">Authorize this app in Google Drive:</p>
          <Button
            onClick={() => {
              signIn(providers?.google.id);
            }}
            className="p-3 text-lg"
          >
            Authorize
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  useEffect(() => {
    if (sessionData?.error === "RefreshAccessTokenError") {
      // signIn(); // Force sign in to hopefully resolve error
      console.log("need resignin");
    }
  }, [sessionData]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        onClick={() => {
          sessionData && createPicker(sessionData.accessToken);
        }}
      >
        fjewifojw===
      </button>
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {/* {secretMessage && <span> - {secretMessage}</span>} */}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
