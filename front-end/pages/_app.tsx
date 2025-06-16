// pages/_app.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <>
      {loading ? <Spinner /> : <Component {...pageProps} />}
    </>
  );
}
