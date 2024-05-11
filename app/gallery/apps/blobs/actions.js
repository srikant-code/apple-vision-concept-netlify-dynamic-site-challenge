'use server';
import { getDeployStore, getStore } from '@netlify/blobs';
import { uploadDisabled } from 'utils';

function store() {
    console.log({ process });
    return getStore({ name: 'albums', consistency: 'strong' });
}

// Always be sanitizing data in real sites!
export async function uploadAlbumAction({ parameters }) {
    if (uploadDisabled) throw new Error('Sorry, uploads are disabled');

    const key = parameters.name;
    await store().setJSON(key ?? 'albums', parameters, { metadata: { createdOn: new Date() } });
    console.log('Stored album with parameters:', parameters, 'to key:', key);
}

export async function listAlbumsAction() {
    const data = await store().list();
    const keys = data.blobs.map(({ key }) => key);
    console.log({ data, keys });
    return keys;
}

export async function getAlbumAction({ albumName }) {
    const data = await store().getWithMetadata(albumName ?? 'albums', { type: 'json' });
    return data;
}
