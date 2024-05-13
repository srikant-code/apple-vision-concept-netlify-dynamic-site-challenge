'use client';

import Image from 'next/image';
import { Button, ExternalLink, ReuseCSS } from './common';
import { useEffect, useState } from 'react';
import { GalleryAppContent as MemoriesAppContent } from './apps/memoriesApp';
import { NewsAppContent } from './apps/discoverApp';
import { SrikantAppContent } from './apps/srikantApp';
import { AlbumsAppContent } from './apps/albumsApp';

export const APP = {
    0: {
        name: 'Memories',
        icon: `/images/applephotos.png`,
        description: (
            <>
                This app leverages Netlify&apos;s <code>Image CDN capability</code> to display photos and{' '}
                <code>Netlify&apos;s blob storage</code> to Add photos to Albums. It allows you to filter images by date
                category. The images are served from cache and optimized for quick loading, demonstrating the efficiency
                and speed of Netlify&apos;s Image CDN.
            </>
        ),
        component: MemoriesAppContent,
        tabs: [
            { id: 0, text: 'Years' },
            { id: 1, text: 'Months' },
            { id: 2, text: 'Days' },
            { id: 3, text: 'All Photos' }
        ]
    },
    1: {
        name: 'Albums',
        icon: `/images/applefiles.png`,
        description: (
            <>
                This app utilizes <code>Netlify&apos;s Blobs</code> storage to store user albums and its contents. In
                this prototype project, there&apos;s no authentication implemented, but I have written a clever and
                complex logic to create anonymous users and handle their albums data in blobs. <br />
                You can see other users albums from the <code>Other&apos;s Albums</code> tab. This feature showcases the
                flexibility and user-friendly nature of Netlify&apos;s Blobs storage.
            </>
        ),
        component: AlbumsAppContent,
        tabs: [
            { id: 0, text: 'Your Albums' },
            { id: 1, text: "Other's Albums" }
        ]
    },
    2: {
        name: 'Discover',
        icon: `/images/applenews.png`,
        description: (
            <>
                This app uses Netlify&apos;s Cache Revalidation technique to fetch the latest articles from the web
                (Wikipedia) using SSR(Server Side Rendering technique of Next JS). <br />
                It highlights how Netlify&apos;s Cache Revalidation can ensure users always have access to the most
                recent information.
            </>
        ),
        component: NewsAppContent,
        tabs: [{ id: 0, text: 'Featured Article' }]
    },
    3: {
        name: 'Srikant',
        icon: `/images/srikant_profile_pic.png`,
        description: (
            <>
                This project is a hobby endeavor that I&apos;m proud of, and I hope it helps you understand the
                potential of Netlify&apos;s capabilities. <br />
                It took me more than 5 days to build this. I will be putting up what all challenges I have faced during
                the development of this, and more details of implementation in the submission article. Would really
                appreciate if you liked it and can vote my submission here 👇
                <br />
                <Button>
                    <ExternalLink href={'https://dev.to/srikant_code'}>Please give a 👍 here😄</ExternalLink>
                </Button>
                <br /> You can connect with me anytime here{' '}
                <ExternalLink href="https://www.linkedin.com/in/srikant-design/">LinkedIn</ExternalLink> |{' '}
                <ExternalLink href="https://twitter.com/srikant_design">Twitter</ExternalLink>
            </>
        ),
        component: SrikantAppContent,
        tabs: [
            { id: 0, text: 'About this project' },
            { id: 1, text: 'References' }
        ]
    }
};

export const PageContent = (props) => {
    const [activeApp, setActiveApp] = useState(0);
    // console.log({ props });

    typeof window !== 'undefined' ? !window.location.origin?.includes('localhost') && (console.log = () => {}) : null;

    const internalStyles = {
        main: {
            ...ReuseCSS.font,
            ...ReuseCSS.center,
            height: '100vh',
            perspectiveOrigin: `center`,
            perspective: '120vw',
            overflow: 'hidden',
            ...ReuseCSS.transition
        }
    };

    const selected = (id) => id === activeApp;

    return (
        <main style={internalStyles.main}>
            <Background />
            <Mouse />
            {Object.keys(APP).map((appKey, id) => {
                return (
                    <AppTemplate
                        key={id}
                        activeApp={activeApp}
                        curAppID={id}
                        setActiveApp={setActiveApp}
                        Component={APP[appKey]?.component}
                        componentProps={props}
                    ></AppTemplate>
                );
            })}
            <app-drawer
                style={{
                    position: 'absolute',
                    bottom: 0,
                    display: 'flex',
                    boxShadow: `0 4px 30px rgba(0, 0, 0, 0.28)`,
                    backdropFilter: `blur(15.1px)`,
                    borderRadius: 40,
                    background: `rgba(255, 255, 255, 0.1)`,
                    padding: 8,
                    marginBottom: 40,
                    gap: 10,
                    border: `2px solid rgba(255, 255, 255, 0.34)`,
                    background: '#15151536'
                }}
            >
                {Object.keys(APP)?.map((app, id) => {
                    return (
                        <Button
                            key={id}
                            style={{ scale: selected(id) ? 1.2 : 1 }}
                            selected={selected(id)}
                            onClick={() => setActiveApp(id)}
                        >
                            {/* {APP[id]?.name} */}
                            <Image style={{}} src={APP[id]?.icon} alt={APP[id]?.name} width={40} height={40} priority />
                        </Button>
                    );
                })}
            </app-drawer>
        </main>
    );
};

const AppWrapper = ({ children, activeApp, curAppID, setActiveApp }) => {
    const isActiveApp = activeApp === curAppID;
    const diff = curAppID - activeApp;
    const curAppIsNext = diff > 0;
    const curAppIsPrev = diff < 0;
    return (
        <div
            aria-label="appContainer"
            style={{
                ...ReuseCSS.font,
                ...ReuseCSS.center,
                padding: 20,
                flexFlow: 'column',
                zIndex: 1,
                marginTop: -110,
                position: isActiveApp ? undefined : 'absolute',
                transform: isActiveApp ? undefined : curAppIsNext ? 'rotateY(-35deg)' : 'rotateY(35deg)',
                left: isActiveApp ? undefined : curAppIsPrev ? 150 * diff : undefined,
                right: isActiveApp ? undefined : curAppIsNext ? -150 * diff : undefined,
                scale: isActiveApp ? undefined : 0.6 - 0.1 * Math.abs(diff),
                zIndex: isActiveApp ? 100 : Math.floor(80 / Math.abs(diff)),
                ...ReuseCSS.transition
            }}
            onClick={() => {
                if (isActiveApp) return;
                else setActiveApp(curAppID);
            }}
        >
            {children}
        </div>
    );
};

export const appContainerStyles = {
    ...ReuseCSS.font,
    margin: 20,
    borderRadius: 40,
    boxShadow: `0 4px 30px rgba(0, 0, 0, 0.28)`,
    backdropFilter: `blur(15.1px)`,
    border: `2px solid rgba(255, 255, 255, 0.34)`,
    // borderImageSource: `linear-gradient(to left, #743ad5, #d53a9d)`,
    padding: 20,
    width: '60vw',
    maxHeight: '60vh',
    overflow: 'scroll',
    resize: 'both',
    ...ReuseCSS.transition
};

const AppTemplate = ({ activeApp, curAppID, setActiveApp, Component, componentProps = {} }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const internalStyles = {
        image: {},
        appContainer: appContainerStyles,
        categoriesContainer: {
            width: 'fit-content',
            borderRadius: 100,
            flexFlow: 'row',
            ...ReuseCSS.center,
            border: `2px solid rgba(255, 255, 255, 0.34)`,
            boxShadow: `0 4px 30px rgba(0, 0, 0, 0.28)`,
            backdropFilter: `blur(45.1px)`,
            padding: 8,
            gap: 10,
            marginTop: -50,
            ...ReuseCSS.transition
        },
        category: (selected) => {
            return {
                ...ReuseCSS.button(selected),
                borderRadius: 100,
                cursor: 'pointer',
                padding: `10px 24px`,
                ...ReuseCSS.transition
            };
        }
    };

    const diff = curAppID - activeApp;
    const curAppIsNext = diff > 0;
    const curAppIsPrev = diff < 0;

    return (
        <AppWrapper activeApp={activeApp} curAppID={curAppID} setActiveApp={setActiveApp}>
            <style>
                {`
                      .appContainer {
                          -ms-overflow-style: none;  /* Internet Explorer 10+ */
                          scrollbar-width: none;  /* Firefox */
                          background: rgba(255, 255, 255, 0.1);
                      }
                      .appContainer:hover {
                          background: #00000040;
                      }
                      .appContainer::-webkit-scrollbar { 
                          display: none;  /* Safari and Chrome */
                      }
                  `}
            </style>
            <h1
                style={{
                    alignSelf: curAppIsNext ? 'flex-end' : curAppIsPrev ? 'flex-start' : undefined,
                    margin: `20px 40px`,
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'center'
                }}
            >
                <Image style={{}} src={APP[curAppID]?.icon} alt={APP[curAppID]?.name} width={48} height={48} priority />
                {APP[curAppID].name}
            </h1>
            <div className="appContainer" style={internalStyles.appContainer}>
                {Component ? (
                    <Component
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        setActiveApp={setActiveApp}
                        activeApp={activeApp}
                        {...componentProps}
                    />
                ) : (
                    children
                )}
            </div>
            <div>
                <div style={internalStyles.categoriesContainer}>
                    {(APP[curAppID].tabs ?? [])?.map((it, key) => {
                        return (
                            <p
                                className="category"
                                key={key}
                                style={internalStyles.category(it.id === selectedTab)}
                                onClick={(e) => {
                                    setSelectedTab(it.id);
                                }}
                            >
                                {it.text}
                            </p>
                        );
                    })}
                </div>
            </div>
        </AppWrapper>
    );
};

export const Background = () => {
    const [mousePos, setMousePos] = useState(0);
    const internalStyles = {
        main: {
            ...ReuseCSS.font,
            ...ReuseCSS.center,
            height: '100vh',
            backgroundImage: `url("/_next/image?url=%2Fimages%2Fspacejoy-9M66C_w_ToM-unsplash.jpg&w=${1920}&q=50")`,
            backgroundColor: `linear-gradient(153deg, rgba(0,0,0,1) 0%, rgba(0,0,94,1) 48%, rgba(0,84,102,1) 100%)`,
            backgroundPosition: `${50 + 10 * (mousePos.clientX / mousePos.innerWidth)}% ${
                50 + 5 * (mousePos.clientY / mousePos.innerHeight)
            }%`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `120% 120%`,
            perspectiveOrigin: `50% 40%`,
            perspective: '120vw',
            overflow: 'hidden',
            width: '100vw',
            position: 'absolute',
            transition: `all 0.2s linear`,
            filter: `brightness(60%)`
        }
    };
    return (
        <>
            <div aria-label="background" style={internalStyles.main}></div>
            <div
                aria-label="blur"
                style={{
                    backdropFilter: `blur(2px)`,
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    perspective: 600,
                    perspectiveOrigin: '100% center'
                }}
                onMouseMove={(e) => {
                    setMousePos({
                        clientX: e.clientX,
                        clientY: e.clientY,
                        innerHeight: e.view.innerHeight,
                        innerWidth: e.view.innerWidth
                    });
                }}
            ></div>
        </>
    );
};

export const Modal = ({ children, style, open, onClose }) => {
    return (
        <>
            {open ? (
                <div className="appContainer" style={{ ...appContainerStyles, style }}>
                    {children}
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

const Mouse = () => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    // Update cursor position on mouse move
    const handleMouseMove = (e) => {
        setCursorPosition({ x: e.clientX - 25, y: e.clientY - 25 });
    };

    useEffect(() => {
        // Add event listener for mousemove
        typeof window !== 'undefined' ? window.addEventListener('mousemove', handleMouseMove) : null;

        // Clean up the event listener when component unmounts
        return () => {
            typeof window !== 'undefined' ? window.removeEventListener('mousemove', handleMouseMove) : null;
        };
    }, []);

    // {/* Your other components go here */}
    return (
        <div
            style={{
                position: 'absolute',
                left: cursorPosition.x,
                top: cursorPosition.y,
                width: 50,
                height: 50,
                borderRadius: '50%',
                pointerEvents: 'none', // Prevent the circle from blocking interactions
                backgroundColor: `rgba(147, 147, 147, 0.26)`,
                zIndex: 10000,
                border: `2px solid rgba(0, 210, 159, 0.69)`,
                transition: `all 0.2s ease 0s`
            }}
        />
    );
};
