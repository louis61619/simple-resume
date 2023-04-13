import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { Dialog } from "~/components/dialog";
import { useEffect } from "react";
import { getToken } from "next-auth/jwt";
import { env } from "~/env.mjs";

const API_KEY = env.GOOGLE_API_KEY;
const APP_ID = env.GOOGLE_APP_ID;

function createPicker(accessToken: string) {
  const docsView1 = new google.picker.DocsView(google.picker.ViewId.DOCS)
    .setIncludeFolders(true)
    .setOwnedByMe(true);
  // .setEnableDrives(true);
  const docsView2 = new google.picker.DocsView(google.picker.ViewId.DOCS)
    .setIncludeFolders(true)
    .setOwnedByMe(false);
  const docsView3 = new google.picker.DocsView(
    google.picker.ViewId.DOCS
  ).setStarred(true);

  const picker = new google.picker.PickerBuilder()
    // .enableFeature(google.picker.Feature.NAV_HIDDEN)
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    .setDeveloperKey(API_KEY)
    .setAppId(APP_ID)
    .setOAuthToken(accessToken)
    // .addView(view)
    .addView(docsView1)
    .addView(docsView2)
    .addView(docsView3)
    .addView(google.picker.ViewId.RECENTLY_PICKED)
    .addView(new google.picker.DocsUploadView())
    // .setCallback(pickerCallback)
    .build();
  picker.setVisible(true);
}

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>simple resume</title>
        <meta name="description" content="create resume by markdown" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AuthShowcase />
        <Dialog />
      </main>
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
