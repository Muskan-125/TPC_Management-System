const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { generateToken } = require('../utils/token');

class AuthService {
  // Register a new user
  async register(userData) {
    const { email, password, name, role, phone, branch, batch } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT',
        phone,
        branch,
        batch
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        branch: true,
        batch: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    return { user, token };
  }

  // Login user
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  // Get user by ID
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        branch: true,
        batch: true,
        createdAt: true
      }
    });

    return user;
  }

  // Validate token and get user
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.getUserById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();

