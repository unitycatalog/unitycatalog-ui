import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';

export default function GoogleAuthButton({
  onGoogleSignIn,
}: {
  onGoogleSignIn: (credential: string) => void;
}) {
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false);
  const clientId = useMemo(() => process.env.REACT_APP_GOOGLE_CLIENT_ID, []);

  const handleGoogleSignIn = useCallback(
    (res: any) => {
      if (!res.clientId || !res.credential) return;
      onGoogleSignIn(res.credential);
    },
    [onGoogleSignIn],
  );

  useEffect(() => {
    if (gsiScriptLoaded) return;

    const initializeGsi = () => {
      // Typescript will complain about window.google
      // Add types to your `react-app-env.d.ts` or //@ts-ignore it.
      if (!(window as any).google || gsiScriptLoaded) return;

      setGsiScriptLoaded(true);
      (window as any).google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-client-button'),
        {
          text: 'Continue with Google', // customization attributes
          width: 240,
          theme: 'outline',
        },
      );
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGsi;
    script.defer = true;
    script.async = true;
    script.id = 'google-client-script';
    document.querySelector('body')?.appendChild(script);

    return () => {
      // Cleanup function that runs when component unmounts
      (window as any).google?.accounts.id.cancel();
      document.getElementById('google-client-script')?.remove();
    };
  }, [handleGoogleSignIn, gsiScriptLoaded]);

  return (
    <>
      {clientId && <Button style={{ width: 240 }} id="google-client-button" />}
    </>
  );
}
