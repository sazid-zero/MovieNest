export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  Headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query, language = "en-US" }: { query: string; language?: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=${language}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?include_adult=false&sort_by=popularity.desc&language=${language}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.Headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies", { cause: response.statusText });
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string,
  language = "en-US"
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}&language=${language}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.Headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

// ==================== TV SHOWS ====================

export const fetchTVShows = async ({ query, language = "en-US" }: { query: string; language?: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(query)}&include_adult=false&language=${language}`
    : `${TMDB_CONFIG.BASE_URL}/discover/tv?include_adult=false&sort_by=popularity.desc&language=${language}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.Headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch TV shows", { cause: response.statusText });
  }

  const data = await response.json();
  return data.results;
};

export const fetchTVShowDetails = async (
  tvId: string,
  language = "en-US"
): Promise<TVShowDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/tv/${tvId}?api_key=${TMDB_CONFIG.API_KEY}&language=${language}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.Headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TV show details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    throw error;
  }
};

export const fetchPopularTVShows = async () => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/tv/popular?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch popular TV shows");
  }

  const data = await response.json();
  return data.results;
};

// ==================== TRENDING ====================

export const fetchTrending = async (
  mediaType: MediaType | "all" = "all",
  timeWindow: TimeWindow = "day",
): Promise<TrendingItem[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending content");
  }

  const data = await response.json();
  return data.results;
};

// ==================== PEOPLE ====================

export const fetchPersonDetails = async (
  personId: string,
): Promise<PersonDetails> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/person/${personId}?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch person details");
  }

  const data = await response.json();
  return data;
};

export const fetchPersonCredits = async (personId: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/person/${personId}/combined_credits?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch person credits");
  }

  const data = await response.json();
  return data;
};

export const fetchPopularPeople = async () => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/person/popular?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch popular people");
  }

  const data = await response.json();
  return data.results;
};

// ==================== VIDEOS ====================

export const fetchMovieVideos = async (movieId: string): Promise<Video[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie videos");
  }

  const data = await response.json();
  return data.results;
};

export const fetchTVVideos = async (tvId: string): Promise<Video[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch TV show videos");
  }

  const data = await response.json();
  return data.results;
};

// ==================== WATCH PROVIDERS ====================

export const fetchWatchProviders = async (id: string, type: "movie" | "tv") => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/${type}/${id}/watch/providers?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watch providers");
  }

  const data = await response.json();
  return data.results;
};

// ==================== RECOMMENDATIONS ====================

export const fetchMovieRecommendations = async (
  movieId: string,
): Promise<Movie[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie recommendations");
  }

  const data = await response.json();
  return data.results;
};

export const fetchTVRecommendations = async (
  tvId: string,
): Promise<TVShow[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/tv/${tvId}/recommendations?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch TV show recommendations");
  }

  const data = await response.json();
  return data.results;
};

// ==================== CREDITS ====================

export const fetchMovieCredits = async (movieId: string): Promise<Credits> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie credits");
  }

  const data = await response.json();
  return data;
};

export const fetchTVCredits = async (tvId: string): Promise<Credits> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/tv/${tvId}/credits?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch TV show credits");
  }

  const data = await response.json();
  return data;
};

// ==================== REVIEWS ====================

export const fetchMovieReviews = async (movieId: string): Promise<Review[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie reviews");
  }

  const data = await response.json();
  return data.results;
};

// ==================== GENRES ====================

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie genres");
  }

  const data = await response.json();
  return data.genres;
};

export const fetchTVGenres = async (): Promise<Genre[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/genre/tv/list?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch TV genres");
  }

  const data = await response.json();
  return data.genres;
};

export const discoverByGenre = async (
  mediaType: "movie" | "tv",
  genreId: number,
) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/discover/${mediaType}?api_key=${TMDB_CONFIG.API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to discover by genre");
  }

  const data = await response.json();
  return data.results;
};

// ==================== MULTI-SEARCH ====================

export const fetchMultiSearch = async (query: string, language = "en-US", includeAdult = false) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/search/multi?query=${encodeURIComponent(query)}&api_key=${TMDB_CONFIG.API_KEY}&include_adult=${includeAdult}&language=${language}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.Headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to perform multi-search");
  }

  const data = await response.json();
  return data.results;
};
