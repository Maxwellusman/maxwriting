import { useEffect } from "react";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}
import { useRouter } from "next/router";
import Script from "next/script";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }: any) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            if (typeof window !== "undefined" && window.gtag) {
                window.gtag("config", "G-X2ZL3XVS4X", {
                    page_path: url,
                });
            }
        };

        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            {/* Google Analytics Script */}
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-X2ZL3XVS4X"
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-X2ZL3XVS4X', { page_path: window.location.pathname });
                    `,
                }}
            />

            {/* SEO Setup */}
            <DefaultSeo
                title="MaxWriting - Professional SEO Content Services"
                description="Boost your online presence with high-quality SEO-optimized content writing services for blogs, websites, and businesses."
                canonical="https://maxwriting.org.uk/"
                openGraph={{
                    type: "website",
                    locale: "en_GB",
                    url: "https://maxwriting.org.uk/",
                    siteName: "MaxWriting",
                    images: [
                        {
                            url: "https://maxwriting.org.uk/og-image.jpg",
                            width: 1200,
                            height: 630,
                            alt: "MaxWriting SEO Content Services",
                        },
                    ],
                }}
            />

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;
