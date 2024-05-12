import Image from 'next/image';
import { Button, ExternalLink } from '../common';
import { APP } from '../pageContent';

export const SrikantAppContent = ({ selectedTab, setActiveApp }) => {
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
                gap: 16px;
                display: flex;
                flex-flow: column;
            }
          `}</style>
            {selectedTab === 0 && (
                <>
                    <div>
                        <div style={{}}>
                            <h2>About this project</h2>
                            <p className="pText">Hey👋, I&apos;m Srikant Sahoo.</p>
                            <p className="pText">
                                I&apos;m excited to present a project that I&apos;ve submitted for{' '}
                                <code className="code">The Netlify Dynamic Site Challenge</code>. This project is a
                                cutting-edge mock-up user interface designed for virtual reality devices, taking
                                inspiration from futuristic concepts like <code className="code">Apple Vision</code>.
                            </p>
                            <p className="pText">
                                Please note that this project is not associated with any organization and is purely a
                                result of my passion and 💘 for technology and innovation.
                            </p>
                            <p className="pText">
                                All the assets, graphics, and icons used in this project have been duly referenced, and
                                you can find the sources in the <code>References</code>. This project is a testament to
                                my commitment to ethical practices in software development.
                            </p>
                            <p className="pText">
                                This project showcases three key features of Netlify, each demonstrated through a
                                different application:
                            </p>
                            <ol>
                                {Object.keys(APP).map((appKey, id) => {
                                    return (
                                        <li key={id}>
                                            <p className="pText">
                                                <Button
                                                    onClick={() => {
                                                        setActiveApp(id);
                                                    }}
                                                    style={{ display: 'flex', justifyContent: 'center', gap: 10 }}
                                                    selected
                                                >
                                                    <Image
                                                        style={{}}
                                                        src={APP[appKey]?.icon}
                                                        alt={APP[appKey]?.name}
                                                        width={28}
                                                        height={28}
                                                        priority
                                                    />
                                                    {APP[appKey]?.name} App
                                                </Button>
                                                {APP[appKey]?.description ?? ''}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>
                </>
            )}
            {selectedTab === 1 && <References />}
        </div>
    );
};

const References = () => {
    const references = [
        {
            id: 1,
            text: 'All Memories and Albums Images (unsplash.com)',
            url: 'http://unsplash.com/',
            description: (
                <>
                    All images in <code>Memories App</code> and the <code>Albums App</code> as well as this project
                    background image, are taken from unsplash.com. If you open a specific image from the{' '}
                    <code>Memories</code> app then you will find the original author and link to original image.
                </>
            )
        },
        {
            id: 2,
            text: 'Apple App Icons',
            url: 'https://google.com',
            description: <>These are open source, and taken from basic Google search results.</>
        },
        {
            id: 3,
            text: 'Images in Discover App',
            url: 'https://en.wikipedia.org/api/rest_v1/page/random/summary',
            description: (
                <>
                    These are directly served from wikipedia random article API
                    https://en.wikipedia.org/api/rest_v1/page/random/summary using SSR(Server Side Rendering technique
                    of Next JS), and the cache is revalidated by clicking the <code>Next Article</code> button.
                </>
            )
        },
        {
            id: 4,
            text: 'Please vote my submission of Netlify dynamic site challenge in Dev.to.',
            url: 'https://dev.to/srikant_code',
            description: (
                <>
                    I will open source the code if it gets selected. It would also motivate me to continue doing further
                    such work😄. You can connect with me here{' '}
                    <ExternalLink href="https://www.linkedin.com/in/srikant-design/">LinkedIn</ExternalLink> |{' '}
                    <ExternalLink href="https://twitter.com/srikant_design">Twitter</ExternalLink>
                </>
            )
        }

        // Add more references as needed
    ];

    return (
        <div>
            <h2>References</h2>
            <p className="pText">
                All the assets, graphics, and icons used in this project have been duly referenced, and you can find the
                sources here. This project is a testament to my commitment to ethical practices in software development.
            </p>
            <ul>
                {references.map((reference) => (
                    <li key={reference.id}>
                        <a href={reference.url} target="_blank" rel="noopener noreferrer">
                            {reference.text}
                        </a>
                        <p>{reference?.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
