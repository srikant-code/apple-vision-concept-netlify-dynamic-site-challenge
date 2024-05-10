'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { UnsplashPhotos } from '../unsplashimages';
import moment from 'moment';

const { ExternalLink, Button, ReuseCSS, MONTH, DAY, CONSTANTS } = require('../common');

export const UnsplashImage = ({ data }) => {
    const reuse = {
        color: {
            color: undefined, //data?.color
            fontWeight: '600'
        }
    };
    const style = {
        container: {
            position: 'absolute',
            bottom: 30,
            left: 30,
            width: '94%'
        },
        profileImage: {
            borderRadius: 100,
            width: 50,
            height: 50,
            border: `2px solid`
        },
        user: {
            display: 'flex',
            flexFlow: 'column',
            ...reuse.color
        },
        links: {
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'flex-end',
            ...reuse.color
        },
        imageWrapper: {
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            ...reuse.color
        },
        wrapperAll: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            ...reuse.color
        }
    };
    return (
        <div style={style.container}>
            <div style={style.wrapperAll}>
                <div style={style.imageWrapper}>
                    <img style={style.profileImage} src={data?.user?.profile_image?.medium} alt={data?.user?.name} />
                    <div style={style.user}>
                        <p>Shot by {data?.user?.name}</p>
                        <div>
                            {data?.user?.portfolio_url && (
                                <>
                                    <ExternalLink href={data?.user?.portfolio_url}>Portfolio</ExternalLink> |&nbsp;
                                </>
                            )}
                            <ExternalLink href={data?.links?.html}>Original Image</ExternalLink>
                        </div>
                    </div>
                </div>
                <div style={style.links}>
                    <p>Taken on {moment(data?.created_at).calendar(null, CONSTANTS.DATEFORMAT)}</p>
                    <p>Taken at {data?.user?.location ? `🌍 ${data?.user?.location}` : data?.alt_description}</p>
                </div>
            </div>
        </div>
    );
};

export const GalleryAppContent = ({ selectedTab, setSelectedTab }) => {
    const [selectedImage, setSelectedImage] = useState(false);

    const internalStyles = {
        image: {},
        photoContainer: {
            ...ReuseCSS.font,
            display: 'flex',
            flexFlow: 'row wrap',
            margin: 0,
            position: 'relative',
            ...ReuseCSS.transition
        },
        photo: (photo) => {
            return {
                ...ReuseCSS.font,
                // ...ReuseCSS.transition,
                border: photo?.border === null ? undefined : `2px solid #ffffff57`,
                borderRadius: 20,
                height: photo.height ?? '55vh',
                width: photo.width === null ? '65vw' : null,
                color: photo?.color,
                objectFit: 'cover',
                cursor: 'pointer'
            };
        },
        photoText: {
            ...ReuseCSS.transition,
            height: selectedImage ? 0 : 'unset',
            position: 'absolute',
            borderRadius: 6,
            padding: selectedImage ? 0 : '2px 6px',
            top: selectedImage ? 0 : 20,
            left: selectedImage ? 0 : 30
        },
        image: {},
        fullImage: {
            ...ReuseCSS.transition,
            opacity: selectedImage ? 1 : 0,
            width: selectedImage ? undefined : 0,
            height: selectedImage ? undefined : 0,
            position: 'relative'
        },
        fullImageContainer: {
            ...ReuseCSS.transition,
            display: 'flex',
            flexFlow: 'row wrap',
            gap: selectedImage ? 0 : selectedTab > 1 ? 15 : 30,
            opacity: !selectedImage ? 1 : 0,
            width: !selectedImage ? undefined : 0,
            height: !selectedImage ? undefined : 0
        }
    };

    const getImages = () => {
        const mapper = {};
        const photos = UnsplashPhotos()?.map((photo, k) => ({
            urls: {
                small:
                    k % 2 === 0
                        ? '/images/spacejoy-9M66C_w_ToM-unsplash.jpg'
                        : k % 3 === 0
                        ? '/images/aleksandr-popov-p5eiH_T0MnE-unsplash.jpg'
                        : '/images/corgi.jpg'
            },
            ...photo,
            height: selectedImage
                ? 0
                : selectedTab === 0
                ? 200
                : selectedTab === 1
                ? 190
                : selectedTab === 2
                ? 180
                : 170,
            width: selectedImage ? 0 : selectedTab === 0 ? 10 : selectedTab === 1 ? 250 : selectedTab === 2 ? 195 : 150,
            year: moment(photo.created_at).year(),
            month: MONTH[moment(photo.created_at).month()],
            day: DAY[moment(photo.created_at).day()]
            // text: 'Sat',
            // created_at: new Date(`2024/02/${1 + k}`),
            // created_at: new Date(photo.created_at),
            // updated_at: new Date(photo.updated_at),
        }));

        photos.forEach((photo) => {
            const key =
                selectedTab === 0
                    ? moment(photo.created_at).year()
                    : selectedTab === 1
                    ? `${MONTH[moment(photo.created_at).month()]} ${moment(photo.created_at).year()}`
                    : selectedTab === 2
                    ? `${DAY[moment(photo.created_at).day()]}`
                    : 'All Photos';
            if (mapper[key]) mapper[key].push(photo);
            else mapper[key] = [photo];
        });

        return mapper;
    };
    const imagesWithCategory = getImages();
    console.log({imagesWithCategory})

    useEffect(() => {
        setSelectedImage(false);
    }, [selectedTab]);

    return (
        <>
            <style>
                {`
                * {
                    transition: all 0.3s ease-in-out;
                }

              .category {
                  border: 2px solid transparent;
              }
              .category:hover {
                  border: 2px solid rgba(255, 255, 255, 0.34);
                  transition: all 0.3s ease-in-out;
              }
              .hoverEffect:hover {
                  
              }
              .galleryImageContainer:hover .galleryParagraph {
                  transition: all 0.3s ease-in-out;
                  background-color: #000000e8;
              }
              .galleryImageContainer .galleryImage {
                  object-position: center;
                  transition: all 0.3s ease-in-out;
              }
              .galleryImageContainer:hover .galleryImage {
                  object-position: top left;
                  transition: all 0.7s ease-in-out;
              }
          `}
            </style>
            <div style={internalStyles.fullImage}>
                <div style={{ position: 'absolute', top: 30, left: 30, display: 'flex', gap: 10 }}>
                    <Button
                        onClick={(e) =>
                            setSelectedImage(selectedImage ? false : { ...selectedImage, height: 600, width: 800 })
                        }
                        circular
                    >
                        &lt;-
                    </Button>
                    <Button onClick={(e) => console.log('Clicked')} style={{}}>
                        Add to Blob List
                    </Button>
                </div>
                <Image
                    style={internalStyles.photo({ ...selectedImage, height: undefined, width: null })}
                    src={
                        selectedImage?.urls?.small
                            ? selectedImage?.urls?.small
                            : selectedImage?.urls?.regular
                            ? selectedImage?.urls?.regular
                            : selectedImage?.urls?.full
                            ? selectedImage?.urls?.full
                            : selectedImage?.urls?.raw
                    }
                    alt={selectedImage?.alt_description ? selectedImage?.alt_description : 'alt text is not available'}
                    width={selectedImage?.width ?? 180}
                    height={selectedImage?.height ?? 37}
                    quality={100}
                    priority
                />
                <UnsplashImage data={selectedImage} />
            </div>
            <div>
                {Object.keys(imagesWithCategory)?.map((category, key) => {
                    return (
                        <div
                            key={key}
                            style={{
                                display: 'flex',
                                flexFlow: 'column',
                                gap: 10,
                                marginTop: key ? (selectedImage ? 0 : 20) : 0,
                                ...ReuseCSS.transition
                            }}
                        >
                            {!selectedImage && (
                                <p
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 2,
                                        ...ReuseCSS.button(true),
                                        borderRadius: 100,
                                        padding: `10px 30px`,
                                        width: 'fit-content',
                                        ...ReuseCSS.transition
                                    }}
                                >
                                    {category}
                                </p>
                            )}
                            <div style={internalStyles.fullImageContainer}>
                                {imagesWithCategory[category]?.map((photo, index) => {
                                    return (
                                        <div
                                            key={index}
                                            style={internalStyles.photoContainer}
                                            className="galleryImageContainer"
                                        >
                                            <div
                                                style={internalStyles.image}
                                                onClick={(e) =>
                                                    setSelectedImage(
                                                        selectedImage ? false : { ...photo, height: 600, width: 800 }
                                                    )
                                                }
                                            >
                                                <Image
                                                    className="galleryImage"
                                                    style={internalStyles.photo({ ...photo, border: null })}
                                                    src={
                                                        photo?.urls?.small
                                                            ? photo?.urls?.small
                                                            : photo?.urls?.regular
                                                            ? photo?.urls?.regular
                                                            : photo?.urls?.full
                                                            ? photo?.urls?.full
                                                            : photo?.urls?.raw
                                                    }
                                                    alt={
                                                        photo?.alt_description
                                                            ? photo?.alt_description
                                                            : 'alt text is not available'
                                                    }
                                                    width={photo.width ?? 180}
                                                    height={photo.height ?? 37}
                                                    priority
                                                />
                                            </div>
                                            <p className="galleryParagraph" style={internalStyles.photoText}>
                                                {selectedTab === 0
                                                    ? photo?.year
                                                    : selectedTab === 1
                                                    ? photo?.month
                                                    : selectedTab === 2
                                                    ? `${photo?.month}, ${photo?.year}`
                                                    : `${moment(photo.created_at).calendar(
                                                          null,
                                                          CONSTANTS.DATEFORMAT
                                                      )}`}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
