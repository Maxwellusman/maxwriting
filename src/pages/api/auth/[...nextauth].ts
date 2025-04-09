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
          console.log('Credentials:', credentials);
          
          const user = await User.findOne({ username: credentials?.username });
          console.log('User found:', user ? true : false);
          
          if (!user) {
            console.log('No user found');
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials?.password || '', user.password);
          console.log('Password valid:', isValid);
          
          if (!isValid) {
            return null;
          }
          
          return { id: user._id.toString(), name: user.username };
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
    maxAge:   60 * 60, // 1 hour
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
    signOut: '/admin/login' // Explicit sign out page
  },
  debug: process.env.NODE_ENV !== 'production',
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: process.env.NODE_ENV === 'production' 
          ? 'maxwel-blogs.vercel.app' // no leading dot
          : 'localhost'
      }
    }
  }
  
});