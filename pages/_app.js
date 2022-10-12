import "bootstrap/dist/css/bootstrap.css";
import Layout from "../comps/Layout";
import Head from "next/head";
import "../styles/globals.css";
import { useEffect } from "react";
//import AuthProvider from "../providers/AuthProvider";
import Providers from "../providers/Providers.comp";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <Providers>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  );
}

export default MyApp;
