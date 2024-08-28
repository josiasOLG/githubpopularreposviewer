import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { UserRepository } from "../../adapters/repositories/UserRepository";
import { User } from "../../entities/User";

const userRepository = new UserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = email ? await userRepository.findByEmail(email) : null;

        if (!user && email) {
          // Criar um novo usuário se não existir e o email estiver presente
          user = await userRepository.create({
            name: profile.displayName,
            email,
            role: "user",
          });
        }

        done(null, user as User);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.getById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
