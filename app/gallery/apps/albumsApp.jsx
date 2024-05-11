import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { uniqueName } from 'utils';
import { Button, CONSTANTS } from '../common';
import { APP } from '../pageContent';
import { UnsplashPhotos } from '../unsplashimages';
import { getAlbumAction, uploadAlbumAction } from './blobs/actions';

export const metadata = {
    title: `Netlify's Blob Storage`
};

export const IDENTIFY_USER = 'userLogIn';
export const GET_CURRENT_TIME = () => new Date().toISOString();
const DRAFT_NEW_ALBUM_TAG = 'new-album-draft';
const ALBUMS_BLOB = 'albumsBlob';

export const MUTATIONS = {
    CREATE_ALBUM: 'CREATE_ALBUM',
    ADD_FILE_TO_ALBUM: 'ADD_FILE_TO_ALBUM',
    DELETE_FILE_FROM_ALBUM: 'DELETE_FILE_FROM_ALBUM',
    MOVE_FILE_TO_ANOTHER_ALBUM: 'MOVE_FILE_TO_ANOTHER_ALBUM'
};

const updateAlbums = async ({ uniqueUserID, loginTime, existingBlobData, postUploadScript = () => {} }) => {
    await uploadAlbumAction({
        parameters: {
            name: ALBUMS_BLOB,
            ...{
                ...existingBlobData,
                [uniqueUserID]: {
                    albums: {
                        ['All Photos']: {
                            name: 'All photos',
                            // id: 'AllPhotos',
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
                            // id: 'Trip',
                            lastUpdatedOn: new Date(),
                            createdOn: loginTime,
                            files: []
                        },
                        Personal: {
                            name: 'Personal',
                            // id: 'Personal',
                            lastUpdatedOn: new Date(),
                            createdOn: loginTime,
                            files: []
                        }
                    }
                }
            }
        }
    });
    postUploadScript();
};

export const updateAlbumBlob = async ({
    mutation,
    payload,
    props = {
        setWasUploaded: () => {},
        setUserAlbums: () => {},
        setBlobData: () => {},
        localStorageID: localStorage.getItem(IDENTIFY_USER),
        postUploadScript: () => {}
    }
}) => {
    console.log('Fetching Album blob...');
    props.setWasUploaded(false);

    const data = await getAlbumAction({ albumName: ALBUMS_BLOB });
    console.log({ data });
    const existingBlobData = data?.data;
    const { name, ...otherBlobUsers } = existingBlobData;
    props.setBlobData(otherBlobUsers);
    props.setUserAlbums(existingBlobData[props.localStorageID] ? existingBlobData[props.localStorageID]?.albums : {});

    // to identify a User Login created album and create a default
    if (!props.localStorageID) {
        const uniqueUserID = uniqueName();
        localStorage.setItem(IDENTIFY_USER, uniqueUserID);
        updateAlbums({ uniqueUserID, loginTime: GET_CURRENT_TIME(), existingBlobData });
    }
    if (props.localStorageID === 'delete-all-albums') await uploadAlbumAction({ parameters: { name: ALBUMS_BLOB } });

    const prepareObj = (obj) => {
        return {
            parameters: {
                name: ALBUMS_BLOB,
                ...existingBlobData,
                [props.localStorageID]: {
                    albums: obj
                }
            }
        };
    };

    if (props.localStorageID) {
        if (mutation === MUTATIONS.CREATE_ALBUM) {
            await uploadAlbumAction(
                prepareObj({
                    ...(existingBlobData[props.localStorageID]?.albums ?? {}),
                    [payload?.name ?? payload?.id]: payload
                })
            );
            props.postUploadScript();
        } else if (mutation === MUTATIONS.ADD_FILE_TO_ALBUM) {
            const mapper = {
                [payload.imageDetails.id]: payload.imageDetails
            };
            (existingBlobData[props.localStorageID]?.albums[payload?.albumNameID]?.files ?? []).forEach((file) => {
                mapper[file?.id] = file;
            });
            await uploadAlbumAction(
                prepareObj({
                    ...(existingBlobData[props.localStorageID]?.albums ?? {}),
                    [payload?.albumNameID]: {
                        ...existingBlobData[props.localStorageID]?.albums[payload?.albumNameID],
                        lastUpdatedOn: new Date(),
                        files: Object.values(mapper)
                    }
                })
            );
            props.postUploadScript();
        } else if (mutation === MUTATIONS.DELETE_FILE_FROM_ALBUM) {
            const mapper = {
                [payload.imageDetails.id]: payload.imageDetails
            };
            (existingBlobData[props.localStorageID]?.albums[payload?.albumNameID]?.files ?? []).forEach((file) => {
                mapper[file?.id] = file;
            });
            delete mapper[payload.imageDetails.id];

            const obj = {
                ...existingBlobData[props.localStorageID]?.albums[payload?.albumNameID],
                lastUpdatedOn: new Date(),
                files: Object.values(mapper)
            };

            await uploadAlbumAction(
                prepareObj({
                    ...(existingBlobData[props.localStorageID]?.albums ?? {}),
                    [payload?.albumNameID]: obj
                })
            );
            props.postUploadScript(obj);
        } else if (mutation === MUTATIONS.MOVE_FILE_TO_ANOTHER_ALBUM) {
            // Implement it
            props.postUploadScript();
        }
    }
};

export const AlbumsAppContent = ({ selectedTab, setActiveApp, activeApp }) => {
    const yourAlbumTab = selectedTab === 0;
    const localStorageID = localStorage.getItem(IDENTIFY_USER);
    const [userAlbums, setUserAlbums] = useState(undefined);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedBlobUser, setSelectedBlobUser] = useState(null);
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [blobData, setBlobData] = useState();
    const [lastMutationTime, setLastMutationTime] = useState(0);

    const postUploadScript = () => {
        setWasUploaded(true);
        setLastMutationTime(Date.now());
    };

    const [wasUploaded, setWasUploaded] = useState(false);

    useEffect(() => {
        setSelectedBlobUser(null);
        setSelectedAlbum(null);
    }, [selectedTab]);

    useEffect(() => {
        console.log('Fetching blobs...');
        updateAlbumBlob({ props: { ...defaultPropsFromMutation } });
        // listAlbumsAction().then((response) => {
        //     console.log({ response });
        //     // setAlbums(response);
        // });
    }, [lastMutationTime, activeApp]);

    const defaultPropsFromMutation = {
        setUserAlbums,
        setWasUploaded,
        localStorageID,
        setBlobData
    };

    const reuse = {
        colFlex: {
            display: 'flex',
            flexFlow: 'column'
        },
        transition: {
            transition: `all 0.2s ease-in-out`
        }
    };
    const styles = {
        albumButton: {
            ...reuse.colFlex,
            justifyContent: 'flex-start',
            paddingLeft: 45,
            fontWeight: 300

            // transition: `all 0.2s ease-in-out`
        },
        albumContainer: {
            ...reuse.colFlex,
            flex: 1,
            gap: 10
            // transition: `all 0.2s ease-in-out`
        },
        containerWrapper: {
            display: 'flex',
            gap: 25
            // transition: `all 0.2s ease-in-out`
        },
        subText: {
            fontSize: 12
            // transition: `all 0.2s ease-in-out`
        },
        file: {
            display: 'flex',
            flexFlow: 'row',
            gap: 20,
            border: '2px solid #e5e5e557',
            borderRadius: 22,
            padding: 10

            // transition: `all 0.2s ease-in-out`
        },
        filePreview: {
            borderRadius: 14,
            objectFit: 'cover',
            width: 60,
            height: 50

            // transition: `all 0.2s ease-in-out`
        },
        noPhotos: {
            ...reuse.colFlex,
            placeContent: 'center',
            padding: selectedAlbum?.id !== DRAFT_NEW_ALBUM_TAG ? 30 : 4,
            gap: selectedAlbum?.id !== DRAFT_NEW_ALBUM_TAG ? 20 : 8
        }
    };

    const otherUsersAlbumTab = !yourAlbumTab;
    const otherUserOpenedAlbum = selectedBlobUser && selectedAlbum;
    const otherUserAlbumTabHomePage = otherUsersAlbumTab && !selectedAlbum;

    useEffect(() => {
        if (selectedAlbum) {
            setSelectedAlbum(userAlbums[(selectedAlbum?.albumID, selectedAlbum?.name)]);
        }
    }, [userAlbums]);

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        {otherUserOpenedAlbum && (
                            <Button
                                // style={styles.albumButton}
                                circular
                                onClick={() => setSelectedAlbum(null)}
                                selected={false}
                            >
                                &lt;-
                            </Button>
                        )}
                        <h2 style={{ margin: 0 }}>
                            {yourAlbumTab ? 'Your' : otherUserOpenedAlbum ? selectedBlobUser : 'Other users'}{' '}
                            {selectedAlbum ? 'Photos' : 'Albums'}
                        </h2>
                    </div>
                    {Object.keys(userAlbums ?? {})?.length ? (
                        <div style={styles.containerWrapper}>
                            {otherUserAlbumTabHomePage && (
                                <div style={{ ...styles.albumContainer, height: 370 }} className="photosContainer">
                                    {Object.keys(blobData ?? {})
                                        ?.filter((d) => d !== localStorageID)
                                        ?.map((blobUser, k) => {
                                            return (
                                                <Button
                                                    key={k}
                                                    // style={styles.albumButton}
                                                    onClick={() => setSelectedBlobUser(blobUser)}
                                                    selected={blobUser === selectedBlobUser}
                                                >
                                                    <p>{blobUser}</p>
                                                    {/* <p style={styles.subText}>{blobData[blobUser]?.files?.length ?? 0} Items</p> */}
                                                </Button>
                                            );
                                        })}
                                </div>
                            )}
                            {(yourAlbumTab || (otherUsersAlbumTab && selectedBlobUser)) && (
                                <div
                                    style={{
                                        ...styles.albumContainer,
                                        flex: otherUserAlbumTabHomePage ? 2 : 1
                                    }}
                                >
                                    {selectedBlobUser && !selectedAlbum && (
                                        <>
                                            <h3>{selectedBlobUser} Albums</h3>
                                            <p style={{ ...styles.subText, marginTop: -20, marginLeft: 2 }}>
                                                Note: You can only view {selectedBlobUser}&apos;s album. You cannot edit
                                                theirs.
                                            </p>
                                        </>
                                    )}
                                    <Albums
                                        {...{
                                            userAlbums,
                                            onClick: (album) =>
                                                setSelectedAlbum({ ...userAlbums[album], albumID: album }),
                                            selectedAlbum
                                        }}
                                    />
                                    {yourAlbumTab && (
                                        <Button
                                            style={{
                                                ...styles.albumButton,
                                                paddingLeft: undefined,
                                                flexFlow: undefined,
                                                justifyContent: 'center'
                                            }}
                                            onClick={() =>
                                                setSelectedAlbum({
                                                    name: 'New Album',
                                                    id: DRAFT_NEW_ALBUM_TAG,
                                                    lastUpdatedOn: new Date(),
                                                    createdOn: GET_CURRENT_TIME(),
                                                    files: []
                                                })
                                            }
                                            selected={false}
                                        >
                                            Create new album
                                        </Button>
                                    )}
                                </div>
                            )}
                            {selectedAlbum && (
                                <div style={{ ...reuse.colFlex, flex: 2, ...reuse.transition }}>
                                    <h3>{selectedAlbum?.name ? selectedAlbum?.name : 'New Album'}</h3>
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
                                        {selectedAlbum?.files?.length &&
                                            (selectedAlbum?.files ?? [])?.map((file) => {
                                                return (
                                                    <div key={file?.id ?? file?.url}>
                                                        <div
                                                            style={{ ...styles.file, justifyContent: 'space-between' }}
                                                        >
                                                            <div style={{ display: 'flex', flexFlow: 'row', gap: 20 }}>
                                                                <Image
                                                                    src={
                                                                        file?.url
                                                                            ? file?.url
                                                                            : file?.urls
                                                                            ? file?.urls?.small
                                                                            : file?.urls?.regular ?? ''
                                                                    }
                                                                    width={60}
                                                                    height={50}
                                                                    alt={
                                                                        file?.name
                                                                            ? file?.name
                                                                            : file?.slug
                                                                            ? `${file.slug.substr(0, 25)}.png`
                                                                            : ''
                                                                    }
                                                                    style={styles.filePreview}
                                                                />
                                                                <div style={{ ...reuse.colFlex, ...reuse.transition }}>
                                                                    <p>
                                                                        {file?.name
                                                                            ? file?.name
                                                                            : file?.slug
                                                                            ? `${file.slug.substr(0, 25)}.png`
                                                                            : ''}
                                                                    </p>
                                                                    <p style={styles.subText}>
                                                                        Modified{' '}
                                                                        {moment(file?.lastUpdatedOn).calendar(
                                                                            null,
                                                                            CONSTANTS.DATEFORMAT
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                onClick={(e) =>
                                                                    updateAlbumBlob({
                                                                        mutation: MUTATIONS.DELETE_FILE_FROM_ALBUM,
                                                                        payload: {
                                                                            albumNameID: selectedAlbum?.albumID,
                                                                            imageDetails: {
                                                                                ...file,
                                                                                lastUpdatedOn: new Date()
                                                                            }
                                                                        },
                                                                        props: {
                                                                            ...defaultPropsFromMutation,
                                                                            postUploadScript: (obj) => {
                                                                                setLastMutationTime(Date.now());
                                                                                setSelectedAlbum(obj);
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                circular
                                                                selected={false}
                                                            >
                                                                ✖
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        {!selectedAlbum?.files?.length && (
                                            <div style={styles.noPhotos}>
                                                {(selectedAlbum?.id
                                                    ? selectedAlbum?.id !== DRAFT_NEW_ALBUM_TAG
                                                    : true) && (
                                                    <>
                                                        <p>
                                                            Oops😮! No photos added to this album yet. Go to Memories
                                                            App and add some photos to this album.
                                                        </p>
                                                        <Button
                                                            onClick={() => {
                                                                setActiveApp(0);
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                gap: 10
                                                            }}
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
                                                    </>
                                                )}
                                                {(selectedAlbum?.id
                                                    ? selectedAlbum?.id === DRAFT_NEW_ALBUM_TAG
                                                    : false) && (
                                                    <>
                                                        <p>Enter the album name</p>
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
                                                                else if (inp === '')
                                                                    setErrorMessage('Please enter an Album name');
                                                                else setErrorMessage('');

                                                                setValue(inp);
                                                                setSelectedAlbum({
                                                                    name: inp,
                                                                    id: DRAFT_NEW_ALBUM_TAG,
                                                                    lastUpdatedOn: new Date(),
                                                                    createdOn: GET_CURRENT_TIME(),
                                                                    files: []
                                                                });
                                                            }}
                                                        />
                                                        {errorMessage && (
                                                            <p style={{ color: '#fff', fontWeight: 600 }}>
                                                                {errorMessage}
                                                            </p>
                                                        )}
                                                        <Button
                                                            disabled={errorMessage}
                                                            style={{
                                                                opacity: errorMessage ? 0.5 : 1,
                                                                marginTop: 10
                                                            }}
                                                            onClick={() => {
                                                                updateAlbumBlob({
                                                                    mutation: MUTATIONS.CREATE_ALBUM,
                                                                    payload: {
                                                                        ...selectedAlbum,
                                                                        id: value
                                                                    },
                                                                    props: {
                                                                        ...defaultPropsFromMutation,
                                                                        postUploadScript: () => {
                                                                            postUploadScript();
                                                                            setSelectedAlbum(null);
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            selected={false}
                                                        >
                                                            Create {value} album
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', placeContent: 'center', height: 380 }}>
                            Loading all albums ...
                        </div>
                    )}
                </>
            }
        </div>
    );
};

export const Albums = ({ userAlbums, onClick, selectedAlbum, selectedAlbumHandler, hideAllPhotos }) => {
    const reuse = {
        colFlex: {
            display: 'flex',
            flexFlow: 'column'
        },
        transition: {
            transition: 'all 0.3s ease-in'
        }
    };
    const styles = {
        albumContainer: {
            ...reuse.colFlex,
            flex: 1,
            gap: 10,
            transition: 'all 0.3s ease-in',
            height: hideAllPhotos ? undefined : 330
        },
        albumButton: {
            ...reuse.colFlex,
            justifyContent: 'flex-start',
            paddingLeft: 45,
            fontWeight: 300,
            ...reuse.transition
        },
        subText: { fontSize: 12, ...reuse.transition }
    };
    const isAdded = (album) => (selectedAlbumHandler ? selectedAlbumHandler(album) === album : false);

    return (
        <div className="photosContainer" style={{ ...styles.albumContainer }}>
            {Object.keys(userAlbums ?? {})
                ?.filter((p) =>
                    hideAllPhotos ? p?.toLowerCase() !== 'all photos' && p?.toLowerCase() !== 'allphotos' : true
                )
                ?.map((album, k) => {
                    return (
                        <Button
                            key={k}
                            style={styles.albumButton}
                            onClick={() => onClick(album, isAdded(album))}
                            selected={userAlbums[album]?.name === selectedAlbum?.name || isAdded(album)}
                        >
                            <p>
                                {userAlbums[album]?.name}
                                {isAdded(album) ? '✔' : ''}
                            </p>
                            <p style={styles.subText}>{userAlbums[album]?.files?.length ?? 0} Items</p>
                        </Button>
                    );
                })}
        </div>
    );
};
