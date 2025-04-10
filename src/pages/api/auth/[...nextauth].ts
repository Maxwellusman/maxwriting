import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

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
          
          if (!user) return null;
          
          const isValid = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );
          
          return isValid ? { id: user._id.toString(), name: user.username } : null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login'
  },
  debug: process.env.NODE_ENV !== 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`, // Simplified name for cross-env compatibility
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Omit domain for localhost, set only for production
        domain: process.env.NODE_ENV === 'production' 
          ? 'maxwel-blogs.vercel.app' // No trailing slash
          : undefined
      }
    }
  }
});