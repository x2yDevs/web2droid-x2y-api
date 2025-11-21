const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Web2Droid x2y API by x2y dev tools' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/v1/generate-apk', (req, res) => {
  const { url, packageName, options = {} } = req.body;
  
  if (!url || !packageName) {
    return res.status(400).json({ 
      error: 'URL and packageName are required' 
    });
  }
  
  const jobId = generateJobId();
  
  res.json({
    jobId,
    status: 'queued',
    message: 'Build job created successfully'
  });
});

function generateJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
  console.log(`Web2Droid x2y API running on port ${PORT}`);
});