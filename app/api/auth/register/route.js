import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Please enter all fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with that email or username already exists' },
        { status: 400 }
      );
    }

    const user = await User.create({ username, email, password });

    // In a real app, you might generate a JWT token here and send it back
    // For this initial phase, we'll just confirm registration.
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      let messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ message: messages.join(', ') }, { status: 400 });
    }
    // Handle duplicate key errors (e.g., if unique constraint fails after findOne check due to race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email or username already in use' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Something went wrong during registration', error: error.message },
      { status: 500 }
    );
  }
}