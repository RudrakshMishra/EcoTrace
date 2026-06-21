const API_BASE_URL = 'http://localhost:3001/api/v1';

// Check if window is defined (client-side)
const isClient = typeof window !== 'undefined';

// Safe localStorage helper
const getLocal = (key: string, fallback: any) => {
  if (!isClient) return fallback;
  const val = localStorage.getItem(key);
  try {
    return val ? JSON.parse(val) : fallback;
  } catch {
    return val || fallback;
  }
};

const setLocal = (key: string, val: any) => {
  if (!isClient) return;
  localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
};

// Initialize fallback local storage state
const initLocalStorageState = () => {
  if (!isClient) return;
  if (!localStorage.getItem('ecotrace_profile')) {
    setLocal('ecotrace_profile', {
      transportScore: 0,
      dietScore: 0,
      homeScore: 0,
      flightScore: 0,
      shoppingScore: 0,
      annualTotal: 0,
      globalPercentile: 50
    });
  }
  if (!localStorage.getItem('ecotrace_logs')) {
    setLocal('ecotrace_logs', []);
  }
  if (!localStorage.getItem('ecotrace_streak')) {
    setLocal('ecotrace_streak', { currentStreak: 0, bestStreak: 0, lastLoggedDay: null });
  }
  if (!localStorage.getItem('ecotrace_goals')) {
    setLocal('ecotrace_goals', []);
  }
  if (!localStorage.getItem('ecotrace_insights')) {
    setLocal('ecotrace_insights', []);
  }
  if (!localStorage.getItem('ecotrace_notifications')) {
    setLocal('ecotrace_notifications', []);
  }
};

if (isClient) {
  initLocalStorageState();
}

// Custom fetch wrapper that includes credentials (cookies) and token headers
async function request(endpoint: string, options: RequestInit = {}) {
  const token = isClient ? localStorage.getItem('ecotrace_token') : null;
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // essential for cookies
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: 'API Request failed' }));
      throw new Error(errData.message || 'API request failed');
    }
    return await res.json();
  } catch (error) {
    // If connection fails, trigger local fallback mode
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('API Server offline. Falling back to local storage database mode.');
      return handleLocalFallback(endpoint, options);
    }
    throw error;
  }
}

// Fallback logic in case NestJS is down
function handleLocalFallback(endpoint: string, options: RequestInit) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : null;

  if (endpoint.startsWith('/auth/register')) {
    const user = { id: 'local-user', name: body.name, email: body.email };
    setLocal('ecotrace_token', 'local-mock-jwt-token');
    setLocal('ecotrace_user', user);
    return user;
  }

  if (endpoint.startsWith('/auth/login')) {
    const user = { id: 'local-user', name: 'Eco Explorer', email: body.email, preferences: { theme: 'dark' } };
    setLocal('ecotrace_token', 'local-mock-jwt-token');
    setLocal('ecotrace_user', user);
    return { accessToken: 'local-mock-jwt-token', user };
  }

  if (endpoint.startsWith('/auth/logout')) {
    if (isClient) {
      localStorage.removeItem('ecotrace_token');
      localStorage.removeItem('ecotrace_user');
    }
    return { message: 'Logged out successfully' };
  }

  if (endpoint.startsWith('/auth/me')) {
    const user = getLocal('ecotrace_user', null);
    if (!user) throw new Error('Unauthorized');
    return {
      ...user,
      preferences: getLocal('ecotrace_preferences', { theme: 'dark', measurementSystem: 'metric' }),
      carbonProfile: getLocal('ecotrace_profile', { annualTotal: 0 }),
      streak: getLocal('ecotrace_streak', { currentStreak: 0, bestStreak: 0 }),
    };
  }

  if (endpoint.startsWith('/carbon/onboarding')) {
    const transportWeights = { car_petrol: 2400, car_diesel: 2200, car_electric: 700, bus: 500, train: 150, bike_walk: 0 };
    const dietWeights = { meat_daily: 3300, meat_occasional: 2000, pescatarian: 1400, vegetarian: 1100, vegan: 700 };
    const homeWeights = { coal_gas: 3000, mixed: 1500, renewable: 300 };
    const flightWeights = { none: 0, few: 900, medium: 2500, high: 5000 };
    const shoppingWeights = { daily: 1200, weekly: 800, monthly: 400, rarely: 100 };

    const t = body.transport || 'bike_walk';
    const d = body.diet || 'vegan';
    const h = body.home || 'renewable';
    const f = body.flights || 'none';
    const s = body.shopping || 'rarely';

    const transportScore = (transportWeights as any)[t] ?? 0;
    const dietScore = (dietWeights as any)[d] ?? 0;
    const homeScore = (homeWeights as any)[h] ?? 0;
    const flightScore = (flightWeights as any)[f] ?? 0;
    const shoppingScore = (shoppingWeights as any)[s] ?? 0;
    const annualTotal = transportScore + dietScore + homeScore + flightScore + shoppingScore;

    let globalPercentile = 50;
    if (annualTotal < 2000) globalPercentile = 85;
    else if (annualTotal < 4000) globalPercentile = 70;
    else if (annualTotal < 4700) globalPercentile = 60;
    else if (annualTotal > 4700) globalPercentile = 30;

    const profile = {
      transportScore,
      dietScore,
      homeScore,
      flightScore,
      shoppingScore,
      annualTotal,
      globalPercentile,
      updatedAt: new Date().toISOString(),
    };

    setLocal('ecotrace_profile', profile);
    
    // Seed default insights based on highest category
    const categories = [
      { name: 'transport', score: transportScore },
      { name: 'diet', score: dietScore },
      { name: 'home', score: homeScore },
      { name: 'flight', score: flightScore },
      { name: 'shopping', score: shoppingScore },
    ];
    categories.sort((x, y) => y.score - x.score);
    const highest = categories[0].name;

    const mockTips = {
      transport: [
        { id: '1', title: 'Switch to Public Transport', description: 'Commute by bus/train.', co2Savings: 500, status: 'TODO' },
        { id: '2', title: 'Commute by Bicycle', description: 'Ride for trips under 5km.', co2Savings: 300, status: 'TODO' }
      ],
      diet: [
        { id: '1', title: 'Reduce Meat Consumption', description: 'Switch to plant meals.', co2Savings: 700, status: 'TODO' },
        { id: '2', title: 'Try Meat-free Mondays', description: 'Pure plant meals on Monday.', co2Savings: 150, status: 'TODO' }
      ],
      home: [
        { id: '1', title: 'Switch to Renewable Energy', description: 'Tariff or solar panels.', co2Savings: 2700, status: 'TODO' },
        { id: '2', title: 'Lower Heating by 1°C', description: 'Lower heating slightly.', co2Savings: 180, status: 'TODO' }
      ],
      flight: [
        { id: '1', title: 'Take Trains for Intercity', description: 'Train instead of short flights.', co2Savings: 600, status: 'TODO' }
      ],
      shopping: [
        { id: '1', title: 'Buy Clothes Second-hand', description: 'Thrift or vintage shopping.', co2Savings: 200, status: 'TODO' }
      ]
    };

    setLocal('ecotrace_insights', (mockTips as any)[highest] || mockTips.diet);

    return profile;
  }

  if (endpoint.startsWith('/carbon/profile')) {
    return getLocal('ecotrace_profile', { annualTotal: 0 });
  }

  if (endpoint.startsWith('/carbon/history')) {
    return getLocal('ecotrace_logs', []);
  }

  if (endpoint.startsWith('/tracker/log')) {
    const logs = getLocal('ecotrace_logs', []);
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      actionType: body.actionType,
      category: body.category,
      co2Delta: body.co2Delta,
      loggedAt: new Date().toISOString()
    };
    logs.push(newLog);
    setLocal('ecotrace_logs', logs);

    // Update streak (local mock logic)
    const streak = getLocal('ecotrace_streak', { currentStreak: 0, bestStreak: 0, lastLoggedDay: null });
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newlyUnlockedBadges: any[] = [];
    if (body.co2Delta < 0) {
      if (streak.lastLoggedDay === yesterdayStr) {
        streak.currentStreak += 1;
      } else if (streak.lastLoggedDay !== todayStr) {
        streak.currentStreak = 1;
      }
      if (streak.currentStreak > streak.bestStreak) {
        streak.bestStreak = streak.currentStreak;
      }
      streak.lastLoggedDay = todayStr;
      setLocal('ecotrace_streak', streak);

      // Check first log badge
      const badges = getLocal('ecotrace_unlocked_badges', []);
      if (badges.length === 0) {
        badges.push('First Log');
        setLocal('ecotrace_unlocked_badges', badges);
        newlyUnlockedBadges.push({ title: 'First Log', icon: '🌱', description: 'Logged first action' });
      }
    }

    return { log: newLog, currentStreak: streak.currentStreak, bestStreak: streak.bestStreak, newlyUnlockedBadges };
  }

  if (endpoint.startsWith('/tracker/logs')) {
    return getLocal('ecotrace_logs', []);
  }

  if (endpoint.startsWith('/tracker/streak')) {
    return getLocal('ecotrace_streak', { currentStreak: 0, bestStreak: 0, lastLoggedDay: null });
  }

  if (endpoint.startsWith('/tracker/badges')) {
    const unlocked = getLocal('ecotrace_unlocked_badges', []);
    const standard = [
      { id: '1', title: 'First Log', description: 'Unlocked by logging first daily action', icon: '🌱', unlocked: unlocked.includes('First Log') },
      { id: '2', title: '7-Day Streak', description: 'Unlocked by active savings for 7 consecutive days', icon: '⚡', unlocked: unlocked.includes('7-Day Streak') },
      { id: '3', title: '1 Ton Saved', description: 'Unlocked by achieving carbon savings of 1,000 kg', icon: '🌍', unlocked: false },
      { id: '4', title: 'Flight-Free Month', description: 'Unlocked by logging zero flights in a month', icon: '✈️', unlocked: false },
      { id: '5', title: 'Vegan Week', description: 'Unlocked by logging 7 plant meals & zero meat in a week', icon: '🥗', unlocked: false }
    ];
    return standard;
  }

  if (endpoint.startsWith('/insights')) {
    if (method === 'PATCH') {
      const insights = getLocal('ecotrace_insights', []);
      const match = endpoint.match(/\/insights\/([a-zA-Z0-9-]+)/);
      const id = match ? match[1] : '';
      
      const updated = insights.map((item: any) => {
        if (item.id === id) {
          return { ...item, status: body.status };
        }
        return item;
      });
      setLocal('ecotrace_insights', updated);
      return updated.find((i: any) => i.id === id);
    }
    return getLocal('ecotrace_insights', []);
  }

  if (endpoint.startsWith('/goals')) {
    const goals = getLocal('ecotrace_goals', []);
    if (method === 'POST') {
      const g = {
        id: Math.random().toString(36).substr(2, 9),
        targetReduction: body.targetReduction,
        currentProgress: 0,
        deadline: body.deadline,
        status: 'active'
      };
      goals.push(g);
      setLocal('ecotrace_goals', goals);
      return g;
    }
    return goals;
  }

  if (endpoint.startsWith('/leaderboard')) {
    // Return standard mock leaderboard
    return [
      { id: '1', userId: '1', greenScore: 520, rank: 1, user: { name: 'Chloe Sinclair', country: 'United Kingdom', avatar: null } },
      { id: '2', userId: '2', greenScore: 420, rank: 2, user: { name: 'Emma Green', country: 'Germany', avatar: null } },
      { id: '3', userId: '3', greenScore: 280, rank: 3, user: { name: 'Alex Rivera', country: 'United States', avatar: null } },
      { id: '4', userId: 'local-user', greenScore: getLocal('ecotrace_logs', []).filter((l: any) => l.co2Delta < 0).reduce((sum: number, l: any) => sum + Math.abs(l.co2Delta), 0), rank: 4, user: { name: 'You (Local)', country: 'Earth', avatar: null } }
    ];
  }

  if (endpoint.startsWith('/notifications')) {
    return getLocal('ecotrace_notifications', []);
  }

  if (endpoint.startsWith('/ai/chat')) {
    return {
      response: `[Local Fallback] Hi! I see your footprint is ${body.context?.annualTotal || 0} kg CO2/yr. Since the backend is offline, I can't reach the AI. Try setting up the Anthropic API key in the backend and running it!`
    };
  }

  throw new Error('Not implemented locally');
}

export const api = {
  // Auth
  register: (dto: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(dto) }),
  login: (dto: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Carbon
  saveOnboarding: (dto: any) => request('/carbon/onboarding', { method: 'POST', body: JSON.stringify(dto) }),
  getProfile: () => request('/carbon/profile'),
  getHistory: () => request('/carbon/history'),
  calculate: (dto: any) => request('/carbon/calculate', { method: 'POST', body: JSON.stringify(dto) }),

  // Tracker
  logAction: (dto: any) => request('/tracker/log', { method: 'POST', body: JSON.stringify(dto) }),
  getLogs: () => request('/tracker/logs'),
  getStreak: () => request('/tracker/streak'),
  getBadges: () => request('/tracker/badges'),

  // Insights
  getInsights: () => request('/insights'),
  updateInsightStatus: (id: string, status: string) => request(`/insights/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Goals
  createGoal: (dto: any) => request('/goals', { method: 'POST', body: JSON.stringify(dto) }),
  getGoals: () => request('/goals'),
  updateGoalProgress: (id: string, currentProgress: number) => request(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify({ currentProgress }) }),

  // Leaderboard
  getLeaderboard: () => request('/leaderboard'),
  getMyRank: () => request('/leaderboard/me'),

  // Notifications
  getNotifications: () => request('/notifications'),

  // AI Chat
  chat: (message: string, context: any) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
};
