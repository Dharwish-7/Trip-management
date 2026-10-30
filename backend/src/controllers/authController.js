import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

// GK-2: Signup
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'traveler', department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = db.getCollection('users');

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: 'Account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role === 'official' ? 'official' : 'traveler',
      department: role === 'official' ? (department || 'Travel Audit & Governance') : undefined,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    db.setCollection('users', users);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
};

// GK-3: Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = db.getCollection('users');
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

// Get current user profile
export const getCurrentUser = (req, res) => {
  const users = db.getCollection('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department
  });
};

// Demo accounts endpoint for easy one-click testing
export const getDemoAccounts = (req, res) => {
  return res.json([
    {
      role: 'traveler',
      label: 'Demo Traveler (Alex Morgan)',
      email: 'traveler@example.com',
      password: 'pass123',
      description: 'Test creating trips, adding places, uploading photos, submitting trips'
    },
    {
      role: 'official',
      label: 'Demo Govt Official (Director Robert Hayes)',
      email: 'official@govt.gov',
      password: 'admin123',
      description: 'Audit submitted trips, search & filter, analytics, photo review gallery'
    }
  ]);
};
