export interface User {
  id: string;
  name: string;
  email: string;
  image?: string; // Optional field for user profile image
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Add any additional authentication methods as needed
}

export interface GoogleAuthResponse {
  profileObj: {
    email: string;
    familyName: string;
    givenName: string;
    googleId: string;
    imageUrl: string;
    name: string;
  };
  tokenId: string;
}