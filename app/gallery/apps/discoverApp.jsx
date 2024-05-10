import moment from 'moment';
import { CONSTANTS, SubmitButton } from '../common';
import { revalidateRandomWiki } from '../page';
import Image from 'next/image';
export const metadata = {
    title: 'On-Demand Revalidation'
};

export const NewsAppContent = ({ selectedTab, setActiveApp, content, extract }) => {
    console.log({ content, extract });
    return (
        <div style={{ padding: 20 }}>
            <style>{`
            .pText {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 12px;
                // color: #333;
            }
            
            li {
                font-size: 16px;
                line-height: 1.6;
                // color: #333;
            }
            
            ol, ul {
                list-style-type: decimal;
                margin-left: 20px;
            }
            .featuredImage {
                object-position: center;
                transition: all 0.3s ease-in-out;
            }
            .featuredImage:hover {
                object-position: top right;
                transition: all 0.3s ease-in-out;
            }
          `}</style>
            {selectedTab === 0 && (
                <>
                    <h2>Discover Articles</h2>
                    <div>
                        <RandomWikiArticle data={content} extract={extract} />
                    </div>
                </>
            )}
        </div>
    );
};

export function RandomWikiArticle({ data, extract }) {
    console.log({ data });
    return (
        <div>
            <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div>
                        <h3>{data?.title}</h3>
                        <p className="pText">{data?.description}</p>
                        <p className="pText">{moment(data?.timestamp).calendar(null, CONSTANTS.DATEFORMAT)}</p>
                        <p className="pText">{data?.extract}</p>
                        <a href={data?.content_urls?.desktop?.page}>More Info | Original Article</a>
                        <form className="mt-4" action={revalidateRandomWiki}>
                            <SubmitButton text="Next Article (Next JS | Revalidate Cache feature)" />
                        </form>
                    </div>
                    <Image
                        style={{ borderRadius: 25, padding: 10, height: 400, width: 400, objectFit: 'cover' }}
                        className="featuredImage"
                        src={data?.thumbnail?.source}
                        alt={data?.title}
                        width={data?.thumbnail.width}
                        height={data?.thumbnail.height}
                    />
                </div>
            </div>
        </div>
    );
}
