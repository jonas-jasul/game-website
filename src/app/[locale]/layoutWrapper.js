// import { NextIntlClientProvider } from "next-intl";
// // import { useLocale } from "next-intl";
// import { notFound } from "next/navigation";
// // await import {messages}

// export function generateStaticParams() {
//     return [{locale: 'en'}, {locale: 'lt'}];
//   }

// export default async function LayoutWrapper({children, params}) {
//     let messages;

//     try {
//         messages = (await import(`../../../messages/${locale}.json`)).default;
//     } catch (error) {
//       notFound();
//     }

//     return (
//         <NextIntlClientProvider locale={params.locale} messages={messages}>

//             {children}
//         </NextIntlClientProvider>
//     )
// }