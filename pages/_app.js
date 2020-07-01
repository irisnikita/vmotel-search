import React, {useEffect} from 'react';
import Router from 'next/router';
import Head from 'next/head';
import hljs from 'highlight.js';
import '../styles/styles.scss';
import 'highlight.js/styles/tomorrow.css';
import 'antd/dist/antd.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-quill/dist/quill.snow.css';
import '../styles/icon.scss';
import i18n from '../i18n';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';
import store from '../Redux/store';
import NProgress from 'nprogress';

NProgress.configure({showSpinner: false});
Router.events.on('routeChangeStart', () => {
    NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({Component, pageProps}) {
    useEffect(() => {
        updateCodeSyntaxHighlighting();
    });

    const updateCodeSyntaxHighlighting = () => {
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightBlock(block);
        });
    };

    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n} >
                <Head>
                    <link rel="stylesheet" type="text/css" href="/nprogress.css" />
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDjwG0kIIoevXXDp3GMdIw-UwUDvKpfwsA&libraries=geometry,places" />
                </Head>
                <Component {...pageProps} />
            </I18nextProvider>
        </Provider>
    );
}