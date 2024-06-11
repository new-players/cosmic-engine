"use client"
import "@farcaster/auth-kit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import type { Session } from "next-auth";
import {PrivyProvider} from '@privy-io/react-auth';

interface IScaffoldEthAppProps {
  children: React.ReactNode;
  session: Session | null;
}

const ScaffoldEthApp = ({ session, children }: IScaffoldEthAppProps) => {
  return (
    <html suppressHydrationWarning style={{height:'100vh'}}>
      <body style={{height:'100vh'}}>
        <SessionProvider session={session}>
          <ThemeProvider enableSystem>
            <PrivyProvider
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
                config={{
                  // Customize Privy's appearance in your app
                  appearance: {
                    theme: 'light',
                    accentColor: '#676FFF',
                    // logo: 'https://your-logo-url',
                  },
                  // Create embedded wallets for users who don't have a wallet
                  embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                  },
                }}            
              >  
              <ScaffoldEthAppWithProviders>
                {children}
              </ScaffoldEthAppWithProviders>
            </PrivyProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;