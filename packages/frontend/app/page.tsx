import Head from "next/head";
import { Suspense } from 'react';
import NavigationBar from '~~/components/cosmic-engine/Navigation/NavigationBar';
import NavigationContent from '~~/components/cosmic-engine/Navigation/NavigationContent';
interface SearchPageProps {
  searchParams: {
    tab: string | null;
  }
}

export default function Home({searchParams}: SearchPageProps) {
  const { tab } = searchParams;

  return (
    <>
    </>
  );
}
