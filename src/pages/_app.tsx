import { AppProps } from 'next/app';
import { Providers } from '@/app/providers';
import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Inter } from "next/font/google";
import '@/app/globals.css';

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Providers>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset>
            <Navbar />
            <main className="flex-1">
              <Component {...pageProps} />
            </main>
          </SidebarInset>
        </div>
      </Providers>
    </div>
  );
}

export default MyApp;
