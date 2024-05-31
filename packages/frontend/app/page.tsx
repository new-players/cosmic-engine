"use client"

import "@farcaster/auth-kit/styles.css";

import Head from "next/head";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse,
} from "@farcaster/auth-kit";
import { useCallback, useState } from "react";

const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://localhost:3000/login",
  domain: "localhost:3000",
};

import { usePrivy } from "@privy-io/react-auth";
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export default function Home() {
  return (
    <>
      <Head>
        <title>Farcaster AuthKit + NextAuth Demo</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <AuthKitProvider config={config}>
          <Content />
        </AuthKitProvider>
      </main>
    </>
  );
}

function Content() {
  const [error, setError] = useState(false);
  const { login } = usePrivy();

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      signIn("credentials", {
        message: res.message,
        signature: res.signature,
        name: res.username,
        pfp: res.pfpUrl,
        redirect: false,
      });
    },
    []
  );

  return (
    <div>
      <div style={{ position: "fixed", top: "80px", right: "12px" }}>
        <SignInButton
          nonce={getNonce}
          onSuccess={handleSuccess}
          onError={() => setError(true)}
          onSignOut={() => signOut()}
        />
        {error && <div>Unable to sign in at this time.</div>}
      </div>
      <div style={{ paddingTop: "33vh", textAlign: "center" }}>
        <h1>@farcaster/auth-kit + NextAuth</h1>
        <p>
          This example app shows how to use{" "}
          <a
            href="https://docs.farcaster.xyz/auth-kit/introduction"
            target="_blank" rel="noreferrer"
          >
            Farcaster AuthKit
          </a>{" "}
          and{" "}
          <a href="https://next-auth.js.org/" target="_blank" rel="noreferrer">
            NextAuth.js
          </a>
          .
        </p>
        <Profile />
        <div>
          <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
              >
                Log in
            </button>          
          <h2>Run this demo:</h2>
          <div
            style={{
              margin: "0 auto",
              padding: "24px",
              textAlign: "left",
              maxWidth: "640px",
              backgroundColor: "#fafafa",
              fontFamily: "monospace",
              fontSize: "1.25em",
              border: "1px solid #eaeaea",
            }}
          >
            git clone https://github.com/farcasterxyz/auth-monorepo.git &&
            <br />
            cd auth-monorepo/examples/with-next-auth &&
            <br />
            yarn install &&
            <br />
            yarn dev
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const { data: session } = useSession();

  console.log(session);

  return session ? (
    <div style={{ fontFamily: "sans-serif" }}>
      <p>Signed in as {session.user?.name}</p>
      <p>
        <button
          type="button"
          style={{ padding: "6px 12px", cursor: "pointer" }}
          onClick={() => signOut()}
        >
          Click here to sign out
        </button>
      </p>
    </div>
  ) : (
    <p>
      Click the &quot;Sign in with Farcaster&quote; button above, then scan the QR code to
      sign in.
    </p>
  );
}
