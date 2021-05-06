import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import '../styles/global.css';
import '../styles/sidebar.css';
import Head from 'next/head';
import {AppProvider} from '../providers/app-provider';
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from 'react';
import getData from '../networking/send-get-request';
import {getAppDetailsUrl} from '../networking/external-url';
config.autoAddCss = false;

const MyApp = ({ Component, pageProps }) => {
  const [appFavIcon, setAppFavIcon] = useState("/favicon.png");

  useEffect(() => {
    getAppDetails();
  }, []);

  const getAppDetails = async () => {
    let appDetailsResponse = await getData(getAppDetailsUrl);
    if(appDetailsResponse) {
        if(appDetailsResponse.responseCode == 99) {
            if(appDetailsResponse.responseData.appFavIconUrl)
                setAppFavIcon(appDetailsResponse.responseData.appFavIconUrl);
        }
    }
  }

  return (
    <>
      <Head>
        <title>Buy Books in Port-harcourt Admin Application</title>
        <link rel="shortcut icon" href={appFavIcon} type="image/png" />
        <style>
          {dom.css()}
        </style>
      </Head>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </>
  )
}

export default MyApp
