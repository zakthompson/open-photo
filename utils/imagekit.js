import ImageKit from 'imagekit-javascript';
import config from '../config';

const imagekit = new ImageKit({
  urlEndpoint: config.imagekitUrl,
});

export default imagekit;
