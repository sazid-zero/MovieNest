import { Client, ID, Query, Account, Avatars, Databases, Storage } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userTableId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  moviesTableId: process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!,
  watchlistTableId: process.env.EXPO_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID!,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID!,
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Update Search Count
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.moviesTableId,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingDoc = result.documents[0];
      await databases.updateDocument(
        config.databaseId,
        config.moviesTableId,
        existingDoc.$id,
        { count: existingDoc.count + 1 }
      );
    } else {
      await databases.createDocument(
        config.databaseId,
        config.moviesTableId,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// Get Trending Movies
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.moviesTableId,
      [Query.limit(5), Query.orderDesc("count")]
    );

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Create User
export const createUser = async (email: string, password: string, username: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw Error;

    const avatarUrl = `${avatars.getInitials(username)}`;

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userTableId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Sign In
export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    // If a session is already active, we can ignore the error and proceed
    if (error.code === 401 && error.message.includes("active")) {
      return await account.getSession("current");
    }
    console.error("Error signing in:", error);
    throw error;
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// ==================== WATCHLIST FUNCTIONS ====================

export const addToWatchlist = async (media: TrendingItem) => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("User not logged in");

    console.log("Adding to watchlist for Account ID:", currentAccount.$id);

    const document = await databases.createDocument(
      config.databaseId,
      config.watchlistTableId,
      ID.unique(),
      {
        userId: currentAccount.$id,
        mediaId: String(media.id),
        mediaType: media.media_type,
        title: media.media_type === "movie" ? media.title : media.name,
        poster_path: media.poster_path,
        vote_average: Math.round(media.vote_average || 0),
        release_date:
          media.media_type === "movie"
            ? media.release_date
            : media.first_air_date,
      }
    );

    return document;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

export const removeFromWatchlist = async (documentId: string) => {
  try {
    await databases.deleteDocument(
      config.databaseId,
      config.watchlistTableId,
      documentId
    );
    return true;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
};

export const getWatchlist = async (userId: string) => {
  try {
    console.log("Fetching watchlist for user:", userId);
    const documents = await databases.listDocuments(
      config.databaseId,
      config.watchlistTableId,
      [Query.equal("userId", userId)]
    );
    
    // Save to cache
    await AsyncStorage.setItem(`watchlist_${userId}`, JSON.stringify(documents.documents));
    
    console.log("Watchlist documents found and cached:", documents.total);
    return documents.documents;
  } catch (error: any) {
    console.error("Error fetching watchlist, trying cache:", error.message || error);
    
    // Try to load from cache on failure
    const cachedData = await AsyncStorage.getItem(`watchlist_${userId}`);
    if (cachedData) {
      console.log("Loaded watchlist from offline cache");
      return JSON.parse(cachedData);
    }
    
    return [];
  }
};

export const checkIsSaved = async (userId: string, mediaId: number) => {
  try {
    const documents = await databases.listDocuments(
      config.databaseId,
      config.watchlistTableId,
      [Query.equal("userId", userId), Query.equal("mediaId", String(mediaId))]
    );
    return documents.total > 0 ? documents.documents[0] : null;
  } catch (error: any) {
    console.error("Error checking if saved:", error.message || error);
    return null;
  }
};

// ==================== STORAGE FUNCTIONS ====================

export const uploadAvatar = async (file: any) => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("User not logged in");

    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );

    const avatarUrl = `${config.endpoint}/storage/buckets/${config.storageId}/files/${uploadedFile.$id}/view?project=${config.projectId}`;

    // Update user document in the database
    const userDocs = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (userDocs.total > 0) {
      await databases.updateDocument(
        config.databaseId,
        config.userTableId,
        userDocs.documents[0].$id,
        { avatar: avatarUrl }
      );
    }

    return avatarUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};