import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction ? 'https://maxwritings.com' : 'http://localhost:3000';
const cookieDomain = isProduction ? 'maxwritings.com' : undefined;
const cookiePrefix = isProduction ? '__Secure-' : '';
const cookieSecure = isProduction;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ username: credentials?.username });

          if (!user) {
            console.log('User not found');
            throw new Error('Invalid credentials');
          }

          const isValid = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );

          if (!isValid) {
            console.log('Invalid password');
            throw new Error('Invalid credentials');
          }

          return { 
            id: user._id.toString(), 
            name: user.username,
            email: user.email || null
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login'
  },
  debug: !isProduction, // Enable in development
  useSecureCookies: cookieSecure,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: cookieSecure,
        domain: cookieDomain
      }
    },
    csrfToken: {
      name: `${cookiePrefix}csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: cookieSecure,
        domain: cookieDomain
      }
    },
    callbackUrl: {
      name: `${cookiePrefix}callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: cookieSecure,
        domain: cookieDomain
      }
    }
  }
});