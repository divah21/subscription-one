const prometheus = require('prom-client');

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

const activeSubscriptions = new prometheus.Gauge({
  name: 'active_subscriptions',
  help: 'Number of active subscriptions'
});

module.exports = {
  httpRequestDurationMicroseconds,
  activeSubscriptions,
  register: prometheus.register
};