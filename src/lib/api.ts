const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      // Revalidate cache every 10 seconds in development / production
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      console.warn(`API error from ${endpoint}: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`Failed to connect to backend at ${API_BASE_URL}${endpoint}:`, err);
    return null;
  }
}

export const api = {
  getProjects: async (lang: string = 'en') => {
    return await fetchFromApi<any[]>(`/projects?lang=${lang}`);
  },

  getExperiences: async (lang: string = 'en') => {
    return await fetchFromApi<any[]>(`/experiences?lang=${lang}`);
  },

  getAchievements: async (lang: string = 'en') => {
    return await fetchFromApi<any[]>(`/achievements?lang=${lang}`);
  },

  getSkills: async () => {
    return await fetchFromApi<any[]>('/skills');
  },

  getProfile: async (lang: string = 'en') => {
    return await fetchFromApi<any>(`/profile?lang=${lang}`);
  },

  submitMessage: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to send message: ${res.statusText}`);
    }

    return await res.json();
  },
};
