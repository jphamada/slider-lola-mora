import path from 'path';
import fs from 'fs';

export default {
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      swiper: path.resolve(__dirname, '../dist/'),
    },
  },
  plugins: [
    {
      name: 'serve-root-images',
      configureServer(server) {
        server.middlewares.use('/api/images', (req, res) => {
          const dirPath = path.join(__dirname, '../images');
          if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath).filter(file => {
              const ext = path.extname(file).toLowerCase();
              return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(files));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
          }
        });

        server.middlewares.use('/images', (req, res, next) => {
          const cleanUrl = req.url.split('?')[0];
          const filePath = path.join(__dirname, '../images', decodeURIComponent(cleanUrl));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200);
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        embed: path.resolve(__dirname, 'embed.html'),
        'local-slider': path.resolve(__dirname, 'local-slider.html'),
      },
    },
  },
};
