'use server';
import { PageContent } from './pageContent';

const tagName = 'randomWiki';
const randomWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
const maxExtractLength = 200;
const revalidateTTL = 60;

import { revalidateTag } from 'next/cache'
 
// export async function revalidateRandomWiki() {
//   revalidateTag('randomWiki')
// }

export default async function Page({}) {
    // const randomWiki = await fetch(randomWikiUrl, {
    //     next: { revalidate: revalidateTTL, tags: [tagName] }
    // });

    // const content = await randomWiki.json();
    // let extract = content.extract;
    // if (extract.length > maxExtractLength) {
    //     extract = extract.slice(0, extract.slice(0, maxExtractLength).lastIndexOf(' ')) + ' [...]';
    // }

    // console.log({ content, extract });
    return <PageContent 
    //content={content} extract={extract} 
    />;
}
