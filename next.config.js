const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: isProd ? 'todo_next' : '',
  images: {
    unoptimized: true, // Optional: If you're using next/image
  },
};
