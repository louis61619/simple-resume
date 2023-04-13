import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useState } from "react";

function gapiLoaded() {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  gapi.load("client:picker", intializePicker);
}

async function intializePicker() {
  await gapi.client.load(
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
  );
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [laoding, setLoading] = useState();

  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Script
        async
        defer
        src="https://apis.google.com/js/api.js"
        onLoad={() => {
          gapiLoaded();
        }}
      ></Script>
    </>
  );
};

export default api.withTRPC(MyApp);
