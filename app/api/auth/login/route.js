import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please enter all fields' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' }, // Use generic message for security
        { status: 401 } // 401 Unauthorized
      );
    }

    // Compare provided password with hashed password in DB
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' }, // Use generic message for security
        { status: 401 } // 401 Unauthorized
      );
    }

    // If login is successful:
    // In a real application, you would generate a JWT here and set it as a cookie
    // or return it to the client. For now, we'll just return a success message
    // and basic user info (without password).
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    return NextResponse.json(
      { message: 'Logged in successfully', user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Something went wrong during login', error: error.message },
      { status: 500 }
    );
  }
}