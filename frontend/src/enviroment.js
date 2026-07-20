let IS_PROD = true;

const server = IS_PROD
  ? "https://konvobackend-2l8p.onrender.com"
  : "http://localhost:8000";

export default server;
