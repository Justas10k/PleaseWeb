const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require('dotenv');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const Post = require('../model/Post'); // Import Post model
const Image = require('../model/image'); // Import Image model
const User = require('../model/User'); // Import User model
const Video = require('../model/video'); // Import Video model

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  };
  return s3Client.send(new PutObjectCommand(uploadParams));
}

function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  const command = new GetObjectCommand(params);
  const seconds = 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  return url;
}


// Updated function syntax
const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const caption = req.body.caption;
    const userId = req.body.userId; // Get userId from request body
    const username = req.body.username; // Get username from request body
    const imageName = generateFileName();

    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();
 
    await uploadFile(fileBuffer, imageName, file.mimetype);

    // Save image information in MongoDB
    const newImage = new Image({
      
      userId, // Use the userId from the request body
      name: imageName,
      fileType: file.mimetype,
      imageUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${imageName}`, // Construct the image URL
    });
    
    await newImage.save();

    const newPost = new Post({
      userId, // Use the userId from the request body
      username, // Use the username from the request body
      imageName,
      caption,
    });
    await newPost.save();

    res.status(201).json({ message: 'Image uploaded successfully', post: newPost, image: newImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

// Updated function syntax for other functions
const getImages = async (req, res) => {

  try {
    const images = await Image.find(); // Fetch all images from MongoDB
    console.log("images :",images , "end")
    const imagesWithUrls = await Promise.all(images.map(async (image) => {
      console.log("before", image.name)
      const url = await getObjectSignedUrl(image.name);
     // Generate signed URL for each image
      return {
        ...image.toObject(),
        imageUrl: url, // Add the signed URL to the image object
      };
    }));
    res.status(200).json(imagesWithUrls); // Send the images with URLs as response
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
};

// Updated function syntax for deleteImage
const deleteImage = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the image in MongoDB
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete the image from S3
    await deleteFile(image.name);

    // Delete the image document from MongoDB
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
};



// Updated function syntax for uploadVideo
const uploadVideo = async (req, res) => {
  const file = req.file; // Get the uploaded file
  const caption = req.body.caption;
  const userId = req.body.userId; // Get userId from request body
  const videoName = generateFileName(); // Generate a unique file name

  try {
    // Check if the file is provided
    if (!file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Upload video to S3
    await uploadFile(file.buffer, videoName, file.mimetype);

    // Save video information in MongoDB
    const newVideo = new Video({
      userId,
      name: videoName,
      videoUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${videoName}`, // Construct the video URL
      caption,
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Error uploading video' });
  }
};

// Updated function syntax for getVideos
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find(); // Fetch all videos from MongoDB
    const videosWithUrls = await Promise.all(videos.map(async (video) => {
      const url = await getObjectSignedUrl(video.name); // Generate signed URL for each video
      return {
        ...video.toObject(),
        videoUrl: url, // Add the signed URL to the video object
      };
    }));
    res.status(200).json(videosWithUrls); // Send the videos with URLs as response
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

// Updated function syntax for deleteVideo
const deleteVideo = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the video in MongoDB
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete the video from S3
    await deleteFile(video.name);

    // Delete the video document from MongoDB
    await Video.findByIdAndDelete(id);

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Error deleting video' });
  }
};

// Updated function syntax for replacing an image
const replaceImage = async (req, res) => {
  const id = req.params.id; // Get the image ID from the request parameters
  const file = req.file; // Get the uploaded file
  const caption = req.body.caption;
  const userId = req.body.userId; // Get userId from request body
  const username = req.body.username; // Get username from request body

  try {
    // Check if the file is provided
    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Find the existing image in MongoDB
    const existingImage = await Image.findById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete the old image from S3
    await deleteFile(existingImage.name);

    // Generate a new file name
    const newImageName = generateFileName();

    // Process the new image
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    // Upload the new image to S3
    await uploadFile(fileBuffer, newImageName, file.mimetype);

    // Update the image information in MongoDB
    existingImage.name = newImageName;
    existingImage.fileType = file.mimetype;
    existingImage.imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${newImageName}`; // Construct the new image URL
    await existingImage.save();

    res.status(200).json({ message: 'Image replaced successfully', image: existingImage });
  } catch (error) {
    console.error('Error replacing image:', error);
    res.status(500).json({ message: 'Error replacing image' });
  }
};

// Updated function syntax for replacing a video
const replaceVideo = async (req, res) => {
  const id = req.params.id; // Get the video ID from the request parameters
  const file = req.file; // Get the uploaded file
  const caption = req.body.caption;
  const userId = req.body.userId; // Get userId from request body

  try {
    // Check if the file is provided
    if (!file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Find the existing video in MongoDB
    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete the old video from S3
    await deleteFile(existingVideo.name);

    // Generate a new file name
    const newVideoName = generateFileName();

    // Upload the new video to S3
    await uploadFile(file.buffer, newVideoName, file.mimetype);

    // Update the video information in MongoDB
    existingVideo.name = newVideoName;
    existingVideo.videoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${newVideoName}`; // Construct the new video URL
    existingVideo.caption = caption; // Update the caption if provided
    await existingVideo.save();

    res.status(200).json({ message: 'Video replaced successfully', video: existingVideo });
  } catch (error) {
    console.error('Error replacing video:', error);
    res.status(500).json({ message: 'Error replacing video' });
  }
};

// Updated function to upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.body.userId; // Get userId from request body
    const file = req.file; // Get the uploaded file
    const profilePictureName = generateFileName(); // Generate a unique file name

    // Check if the file is provided
    if (!file) {
      return res.status(400).json({ message: 'No profile picture file uploaded' });
    }

    // Find the existing user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user already has a profile picture, delete it from S3
    if (user.profilePicture) {
      await deleteFile(user.profilePicture); // Delete the old profile picture from S3
    }

    // Process the new image
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    // Upload the new profile picture to S3
    await uploadFile(fileBuffer, profilePictureName, file.mimetype);

    // Update the user's profile picture in MongoDB
    await User.findByIdAndUpdate(userId, { profilePicture: profilePictureName }, { new: true });

    res.status(201).json({ message: 'Profile picture uploaded successfully', profilePictureName });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
};

// Updated function to get profile picture
const getProfilePicture = async (req, res) => {
  const userId = req.params.id; // Get userId from request parameters

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has a profile picture
    if (!user.profilePicture) {
      return res.status(202).json({ message: 'Default' });
    }

    // Generate signed URL for the profile picture
    const url = await getObjectSignedUrl(user.profilePicture); // Use the existing function to get signed URL
    res.status(200).json({ profilePicture: url });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Error fetching profile picture' });
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
  uploadVideo,
  getVideos,
  deleteVideo,
  replaceImage,
  replaceVideo,
  uploadProfilePicture,
  getProfilePicture,
};


