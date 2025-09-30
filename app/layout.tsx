import "./globals.css"
import "../styles/chat-animations.css"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import type { Metadata, Viewport } from 'next'
import { Vazirmatn } from 'next/font/google'

const vazir = Vazirmatn({ 
  subsets: ['arabic'],
  display: 'swap',
  adjustFontFallback: false, 
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://carsiq.ai'),
  title: 'هندسة السيارات - مساعد الزيوت الذكي',
  description: 'محادثة ذكية للحصول على استشارات السيارات وتوصيات الشراء بشكل فوري',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'هندسة السيارات'
  },
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    url: 'https://carsiq.ai/',
    title: 'هندسة السيارات - مساعد الزيوت الذكي',
    description: 'محادثة ذكية للحصول على استشارات السيارات وتوصيات الشراء بشكل فوري',
    siteName: 'هندسة السيارات',
    images: [{
      url: '/logo.png',
      width: 800,
      height: 600,
      alt: 'هندسة السيارات - مساعد الزيوت الذكي'
    }]
  }
}

export const viewport: Viewport = {
  themeColor: '#1a73e8'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Create a static HTML structure that won't be affected by hydration
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <title>هندسة السيارات - مساعد الزيوت الذكي</title>
        <meta name="description" content="محادثة ذكية للحصول على استشارات السيارات وتوصيات الشراء بشكل فوري" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        {/* Add custom Arabic font directly */}
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Custom style to ensure Arabic text alignment */}
        <style dangerouslySetInnerHTML={{__html: `
          body {
            font-family: 'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            text-align: right;
          }
        `}} />
      </head>
      <body className={`${vazir.className} m-0 p-0 min-h-[100svh] w-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Static loading indicator */}
          <div id="loading-container" style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fafafa',
            zIndex: 9999,
            opacity: 0, // Hidden by default, will be shown by JS
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none', // Prevent interaction
          }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #6a4df4',
                borderRadius: '50%',
              }}></div>
              <p style={{ fontSize: '14px', color: '#666' }}>جاري تحميل المحادثة...</p>
            </div>
          </div>
          
          <div id="root" className="flex min-h-[100svh] flex-col">
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>

        {/* Analytics */}
        <Analytics />
        
        {/* Loader script */}
        <Script id="loader-script" strategy="afterInteractive">
          {`
            (function() {
              const loader = document.getElementById('loading-container');
              if (!loader) return;
              
              // Force hide after 8 seconds maximum (failsafe)
              const forceHideTimeout = setTimeout(() => {
                if (loader) {
                  loader.style.opacity = '0';
                  loader.style.pointerEvents = 'none';
                  console.log('Loader hidden by timeout');
                }
              }, 8000);
              
              // Try to detect when app is actually ready
              const checkAppReady = () => {
                // Check if the app content is rendered
                const appContent = document.getElementById('root');
                if (appContent && appContent.children.length > 0) {
                  clearTimeout(forceHideTimeout);
                  loader.style.opacity = '0';
                  loader.style.pointerEvents = 'none';
                  console.log('Loader hidden by app ready detection');
                  return true;
                }
                return false;
              };
              
              // Set loader to visible first
              loader.style.opacity = '1';
              loader.style.pointerEvents = 'auto';
              
              // Check immediately
              if (!checkAppReady()) {
                // Check again after hydration typically completes
                setTimeout(checkAppReady, 500);
                setTimeout(checkAppReady, 1000);
                setTimeout(checkAppReady, 2000);
              }
              
              // Add listeners for different events that might indicate app is ready
              window.addEventListener('load', () => {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                console.log('Loader hidden by load event');
              });
              
              document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                  if (loader.style.opacity !== '0') {
                    loader.style.opacity = '0';
                    loader.style.pointerEvents = 'none';
                    console.log('Loader hidden by DOMContentLoaded event');
                  }
                }, 300);
              });
              
              // Legacy support for browsers without svh
              function setMobileHeight() {
                // This sets a fallback for browsers that don't support svh
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
              }
              
              // Set initial height
              setMobileHeight();
              
              // Update height on resize and orientation change
              window.addEventListener('resize', setMobileHeight);
              window.addEventListener('orientationchange', () => {
                // Add slight delay for orientation changes to complete
                setTimeout(setMobileHeight, 100);
              });
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
