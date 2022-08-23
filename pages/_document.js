import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head>   
                    <link rel="icon" href="/favicon.ico" />
                    <link rel='manifest' href='/manifest.json' />
                    <link rel='apple-touch-icon' href='/favicon.ico' />
                    <meta name="theme-color" content="#15202B" />
                    <meta name="msapplication-navbutton-color" content="#15202B" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#15202B" />
                    <meta name="description" content="Swoou reuniversity - Simulacro y Banco de Preguntas para preuniversitarios" />
                    <meta name="keywords" content="Swoou, Swoou preuniversity, Banco de Preguntas para preuniversitarios" />
                    <meta name="author" content="Raul Choque Romero, web and app developer, fundador de swoou.com" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}