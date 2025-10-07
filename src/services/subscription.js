const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const winston = require('winston');

const app = express();
app.use(express.json());

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/subscriptions', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Subscription Model
const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'paused'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: Date
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.post('/subscriptions', async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Subscription Service running on port ${PORT}`);
});