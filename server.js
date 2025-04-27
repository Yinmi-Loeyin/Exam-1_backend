const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage
let users = [];
let rooms = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  // In a real app, verify the JWT token here
  next();
};

// Routes
app.post('/api/auth/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { id: Date.now(), username, password, role };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real app, generate a JWT token here
  res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
});

// Protected routes
app.get('/api/rooms', authenticateToken, (req, res) => {
  res.json(rooms);
});

app.post('/api/rooms', authenticateToken, (req, res) => {
  const { name, capacity, description } = req.body;
  if (!name || !capacity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newRoom = { id: Date.now(), name, capacity, description, status: 'available' };
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 