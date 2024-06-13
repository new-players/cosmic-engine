"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { SessionProvider } from "next-auth/react";
import { PrivyProvider } from '@privy-io/react-auth';
import type { Session } from "next-auth"; 

const farcasterAuthKitConfig = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://localhost:3000/login",
  domain: "localhost:3000",
};


const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <Header />        
      <div className="relative flex flex-col grow">
        {children}
      </div>
      <Footer />
      <Toaster />
    </div>
  )
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ session, children }: { session: Session | null, children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full w-full">
      <SessionProvider session={session}>
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
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <ProgressBar />
              <AuthKitProvider config={farcasterAuthKitConfig}>
              <RainbowKitProvider
                avatar={BlockieAvatar}
                theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
              >
                <ScaffoldEthApp>
                  {children}
                </ScaffoldEthApp>
              </RainbowKitProvider>
              </AuthKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </PrivyProvider>
      </SessionProvider>
    </div>
  );
};
