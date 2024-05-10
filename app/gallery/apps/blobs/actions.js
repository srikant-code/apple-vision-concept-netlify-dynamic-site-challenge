'use server';
import { getStore } from '@netlify/blobs';
// import { uploadDisabled } from 'utils';

function store() {
    return getStore({ name: 'albums', consistency: 'strong' });
}

// Always be sanitizing data in real sites!
export async function uploadAlbumAction({ parameters }) {
    // if (uploadDisabled) throw new Error('Sorry, uploads are disabled');

    const key = parameters.name;
    await store().setJSON(key, parameters, { metadata: { createdOn: new Date() } });
    console.log('Stored album with parameters:', parameters, 'to key:', key);
}

export async function listAlbumsAction() {
    const data = await store().list();
    const keys = data.blobs.map(({ key }) => key);
    return keys;
}

export async function getAlbumAction({ albumName }) {
    const data = await store().getWithMetadata(albumName, { type: 'json' });
    return data;
}
