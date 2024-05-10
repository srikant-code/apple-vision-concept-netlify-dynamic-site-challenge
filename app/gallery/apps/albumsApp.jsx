import { useEffect, useState } from 'react';
import { getAlbumAction, listAlbumsAction, uploadAlbumAction } from './blobs/actions';
import { Button, CONSTANTS } from '../common';
import moment from 'moment';
import Image from 'next/image';
import { UnsplashPhotos } from '../unsplashimages';
import { APP } from '../pageContent';
import { uniqueName } from 'utils';

export const metadata = {
    title: `Netlify's Blob Storage`
};

const IDENTIFY_USER = 'userLogIn';

export const AlbumsAppContent = ({ selectedTab, setActiveApp, activeApp }) => {
    const yourAlbumTab = selectedTab === 0;
    const localStorageID = localStorage.getItem(IDENTIFY_USER);
    const [userAlbums, setUserAlbums] = useState(undefined);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('hello');
    const [blobData, setBlobData] = useState();
    const [lastMutationTime, setLastMutationTime] = useState(0);

    const ALBUMS_BLOB = 'albumsBlob';

    const initialAlbumBlobSelect = async (albumName = ALBUMS_BLOB) => {
        console.log('Fetching Album blob...');

        const data = await getAlbumAction({ albumName });
        console.log({ data });
        setBlobData(data?.data);
        setUserAlbums(data?.data[localStorageID] ? data?.data[localStorageID]?.albums : {});

        // to identify a User Login created album and create a default
        if (!localStorageID) {
            const uniqueUserID = uniqueName();
            const loginTime = new Date().toISOString();
            localStorage.setItem(IDENTIFY_USER, uniqueUserID);
            updateAlbums({ uniqueUserID, loginTime, existingBlobData: data?.data });
        }
        if (localStorageID === 'delete-all-albums') await uploadAlbumAction({ parameters: { name: ALBUMS_BLOB } });
    };

    const [wasUploaded, setWasUploaded] = useState(false);

    const updateAlbums = async ({ uniqueUserID, loginTime, existingBlobData }) => {
        await uploadAlbumAction({
            parameters: {
                name: ALBUMS_BLOB,
                ...{
                    ...existingBlobData,
                    [uniqueUserID]: {
                        albums: {
                            AllPhotos: {
                                name: 'All photos',
                                lastUpdatedOn: new Date(),
                                createdOn: loginTime,
                                files: UnsplashPhotos()?.map((img) => {
                                    return {
                                        name: `${img.slug.substr(0, 25)}.png`,
                                        url: img?.urls?.small
                                            ? img?.urls?.small
                                            : img?.urls?.regular
                                            ? img?.urls?.regular
                                            : img?.urls?.full,
                                        lastUpdatedOn: img.updated_at,
                                        ...img
                                    };
                                })
                            },
                            Trip: {
                                name: 'Trip',
                                lastUpdatedOn: new Date(),
                                createdOn: loginTime,
                                files: []
                            },
                            Personal: {
                                name: 'Personal',
                                lastUpdatedOn: new Date(),
                                createdOn: loginTime,
                                files: []
                            }
                        }
                    }
                }
            }
        });
        setWasUploaded(true);
        setLastMutationTime(Date.now());
    };

    useEffect(() => {
        console.log('Fetching blobs...');
        initialAlbumBlobSelect();
        // listAlbumsAction().then((response) => {
        //     console.log({ response });
        //     // setAlbums(response);
        // });
    }, [lastMutationTime, activeApp]);

    const reuse = {
        colFlex: {
            display: 'flex',
            flexFlow: 'column'
        },
        transition: {
            transition: undefined //'all 0.3s ease-in'
        }
    };
    const styles = {
        albumButton: {
            ...reuse.colFlex,
            justifyContent: 'flex-start',
            paddingLeft: 45,
            fontWeight: 300,
            ...reuse.transition
        },
        albumContainer: { ...reuse.colFlex, flex: 1, gap: 10, ...reuse.transition },
        containerWrapper: { display: 'flex', gap: 25, ...reuse.transition },
        subText: { fontSize: 12, ...reuse.transition },
        file: {
            display: 'flex',
            flexFlow: 'row',
            gap: 20,
            border: '2px solid #e5e5e557',
            borderRadius: 22,
            padding: 10,
            ...reuse.transition
        },
        filePreview: {
            borderRadius: 14,
            objectFit: 'cover',
            width: 60,
            height: 50,
            ...reuse.transition
        },
        noPhotos: {
            ...reuse.colFlex,
            placeContent: 'center',
            padding: 30,
            gap: 20
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <style>{`
                .photosContainer {
                    -ms-overflow-style: none;  /* Internet Explorer 10+ */
                    scrollbar-width: none;  /* Firefox */
                }
                .photosContainer::-webkit-scrollbar { 
                    display: none;  /* Safari and Chrome */
                }
          `}</style>
            {
                <>
                    <h2>
                        {yourAlbumTab ? 'Your' : 'Other users'} {selectedAlbum ? 'Photos' : 'Albums'}
                    </h2>
                    {Object.keys(userAlbums ?? {})?.length ? (
                        <div style={styles.containerWrapper}>
                            <div style={styles.albumContainer}>
                                {Object.keys(userAlbums ?? {})?.map((album, k) => {
                                    return (
                                        <Button
                                            key={k}
                                            style={styles.albumButton}
                                            onClick={() => setSelectedAlbum(userAlbums[album])}
                                            selected={userAlbums[album]?.name === selectedAlbum}
                                        >
                                            <p>{userAlbums[album]?.name}</p>
                                            <p style={styles.subText}>{userAlbums[album]?.files?.length ?? 0} Items</p>
                                        </Button>
                                    );
                                })}
                                <Button
                                    style={{
                                        ...styles.albumButton,
                                        paddingLeft: undefined,
                                        flexFlow: undefined,
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setSelectedAlbum(null)}
                                    selected={false}
                                >
                                    Create new album
                                </Button>
                            </div>
                            {selectedAlbum && (
                                <div style={{ ...reuse.colFlex, flex: 2, ...reuse.transition }}>
                                    <h3>{selectedAlbum?.name}</h3>
                                    <p
                                        style={{
                                            ...styles.subText,
                                            ...reuse.transition,
                                            marginTop: -20,
                                            marginLeft: 2
                                        }}
                                    >
                                        {selectedAlbum?.files?.length ?? 0} Items
                                    </p>
                                    <div
                                        className="photosContainer"
                                        style={{
                                            ...reuse.colFlex,
                                            ...reuse.transition,
                                            gap: 10,
                                            marginTop: 10,
                                            height: 370,
                                            overflow: 'auto'
                                        }}
                                    >
                                        {selectedAlbum?.files?.length ? (
                                            selectedAlbum?.files?.map((file, id) => {
                                                return (
                                                    <div key={id} style={styles.file}>
                                                        <Image
                                                            src={file?.url}
                                                            width={60}
                                                            height={50}
                                                            alt={file?.name}
                                                            style={styles.filePreview}
                                                        />
                                                        <div style={{ ...reuse.colFlex, ...reuse.transition }}>
                                                            <p>{file?.name}</p>
                                                            <p style={styles.subText}>
                                                                Modified{' '}
                                                                {moment(file?.lastUpdatedOn).calendar(
                                                                    null,
                                                                    CONSTANTS.DATEFORMAT
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={styles.noPhotos}>
                                                <p>
                                                    Oops😮! No photos added to this album yet. Go to Memories App and
                                                    add some photos to this album.
                                                </p>
                                                <Button
                                                    onClick={() => {
                                                        setActiveApp(0);
                                                    }}
                                                    style={{ display: 'flex', justifyContent: 'center', gap: 10 }}
                                                    selected
                                                >
                                                    <Image
                                                        style={{}}
                                                        src={APP[0]?.icon}
                                                        alt={APP[0]?.name}
                                                        width={28}
                                                        height={28}
                                                        priority
                                                    />
                                                    Open {APP[0]?.name} App
                                                </Button>
                                                <input
                                                    style={{
                                                        padding: `16px 22px`,
                                                        borderRadius: 18,
                                                        background: 'transparent',
                                                        border: '2px solid #e5e5e557',
                                                        outline: 'none'
                                                    }}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const inp = e.target.value;
                                                        if (
                                                            Object.keys(userAlbums ?? {}).find(
                                                                (alb) => alb?.toLowerCase() === inp
                                                            )
                                                        )
                                                            setErrorMessage(
                                                                'Album already exists! Please try any other name.'
                                                            );
                                                        else setErrorMessage('');

                                                        setValue(inp);
                                                    }}
                                                />
                                                {errorMessage && (
                                                    <p style={{ color: '#ff22aa', fontWeight: 600 }}>{errorMessage}</p>
                                                )}
                                                <Button
                                                    disabled={errorMessage}
                                                    style={{}}
                                                    onClick={() => {}}
                                                    selected={false}
                                                >
                                                    Create {value} album
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', placeContent: 'center' }}>Loading all albums ..⌛..</div>
                    )}
                </>
            }
        </div>
    );
};
