import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useState } from "react";
import { Loading } from "~/components/loading";
import { ResumeContextProvider } from "~/hook/useResume";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <ResumeContextProvider>
          <Component {...pageProps} />
        </ResumeContextProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
