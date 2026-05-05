import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'

const PIXEL_ID = '765820343131420'

declare global {
  interface Window { fbq: any }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // Load pixel script once
    if (document.getElementById('fb-pixel')) return
    const script = document.createElement('script')
    script.id = 'fb-pixel'
    script.async = true
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    // Fire PageView on every route change
    const handleRoute = () => {
      if (window.fbq) window.fbq('track', 'PageView')
    }
    router.events.on('routeChangeComplete', handleRoute)
    return () => router.events.off('routeChangeComplete', handleRoute)
  }, [router.events])

  return <Component {...pageProps} />
}
