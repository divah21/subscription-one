const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const services = {
  subscriptions: process.env.SUBSCRIPTION_SERVICE_URL || 'http://localhost:3001'
};

app.use('/subscriptions', createProxyMiddleware({
  target: services.subscriptions,
  changeOrigin: true,
  pathRewrite: { '^/subscriptions': '' }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});