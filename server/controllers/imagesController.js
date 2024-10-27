const { BlobServiceClient } = require('@azure/storage-blob');
const { MongoClient } = require('mongodb');
const Image = require('../model/image');
require('dotenv').config();
const mongodbUri = process.env.DATABASE_URI;
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

const client = new MongoClient(mongodbUri);
client.connect();

async function extractMetaData(headers) {
    const contentType = headers['content-type'];
    const fileType = contentType.split('/')[1];
    const contentDisposition = headers['content-disposition'];
    const caption = headers['x-image-caption'] || 'no caption';
    const matches = /filename="([^"]+)/i.exec(contentDisposition);
    const fileName = matches?.[1] || `image-${Date.now()}.${fileType}`;

    return { fileName, caption, fileType };
}

async function uploadImageStream(blobName, dataStream) {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadStream(dataStream);
    return blobClient.url;
}

const storeMetadata = async (name, caption, fileType, imageUrl) => {
    const newImage = new Image({
        name,
        caption,
        fileType,
        imageUrl,
    });
    await newImage.save(); // Save the image metadata to the database
};

const handleImageUpload = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST') {
        try {
            const { fileName, caption, fileType } = await extractMetaData(req.headers);
            const imageUrl = await uploadImageStream(fileName, req);
            await storeMetadata(fileName, caption, fileType, imageUrl);

            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Image uploaded. Metadata stored.' }));
        } catch (error) {
            console.log(error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Server error" }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
};

module.exports = { handleImageUpload };