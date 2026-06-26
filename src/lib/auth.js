import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("nexPrompt_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { 
    enabled: true, 
  },
  user: {
    additionalFields: {
        role: {
            default: 'user'
        },
        plan: {
          default: 'free_user'
        }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      mapProfileToUser: (profile) =>{
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
          plan: "free_user"
        }
      }
    }
  }
});