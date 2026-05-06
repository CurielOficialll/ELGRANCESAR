import { BettingMarket, MarketStatus } from '../types/market.types';

const API_KEY = import.meta.env.VITE_SPORTS_API_KEY;
const API_HOST = import.meta.env.VITE_SPORTS_API_HOST;

interface ApiFixtureResponse {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      elapsed?: number;
    };
  };
  league: {
    name: string;
  };
  teams: {
    home: { name: string; logo: string; winner: boolean | null };
    away: { name: string; logo: string; winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

/**
 * Service to interact with external Sports Data APIs (API-FOOTBALL)
 */
export const sportsDataService = {
  /**
   * Fetch live football fixtures for a specific league or generally.
   */
  async fetchLiveFixtures(leagueId?: number): Promise<BettingMarket[]> {
    if (API_KEY === 'TU_API_KEY_AQUI') {
      console.warn('Usando datos de prueba: API Key no configurada en .env');
      return this.getMockData();
    }

    try {
      const url = `https://${API_HOST}/v3/fixtures?live=all${leagueId ? `&league=${leagueId}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'x-apisports-key': API_KEY,
          'x-rapidapi-host': API_HOST
        }
      });

      const data = await response.json();
      return this.mapToBettingMarkets(data.response || []);
    } catch (error) {
      console.error('Error fetching live fixtures:', error);
      throw error;
    }
  },

  /**
   * Map API-FOOTBALL response to our internal BettingMarket format.
   */
  mapToBettingMarkets(apiFixtures: ApiFixtureResponse[]): BettingMarket[] {
    return apiFixtures.map(f => {
      // Mocking odds as API-FOOTBALL /odds endpoint is separate and often has different rate limits
      // In a production app, we would also call /odds/{fixture_id}
      const mockHomeOdds = 1.5 + Math.random() * 2;
      const mockAwayOdds = 1.5 + Math.random() * 2;
      const mockDrawOdds = 2.0 + Math.random() * 2;

      return {
        id: `api-fb-${f.fixture.id}`,
        name: `${f.teams.home.name} vs ${f.teams.away.name}`,
        category: f.league.name,
        startTime: new Date(f.fixture.date),
        status: this.mapStatus(f.fixture.status.short),
        teams: [
          {
            name: f.teams.home.name,
            score: f.goals.home ?? 0,
            odds: Number(mockHomeOdds.toFixed(2)),
            logo: f.teams.home.logo
          },
          {
            name: f.teams.away.name,
            score: f.goals.away ?? 0,
            odds: Number(mockAwayOdds.toFixed(2)),
            logo: f.teams.away.logo
          }
        ],
        drawOdds: Number(mockDrawOdds.toFixed(2)),
        liveTime: f.fixture.status.elapsed ? `${f.fixture.status.elapsed}'` : undefined
      };
    });
  },

  mapStatus(shortStatus: string): MarketStatus {
    const liveStatuses = ['1H', 'HT', '2H', 'ET', 'P', 'BT', 'LIVE'];
    if (liveStatuses.includes(shortStatus)) return MarketStatus.LIVE;
    if (shortStatus === 'NS') return MarketStatus.UPCOMING;
    if (['FT', 'AET', 'PEN'].includes(shortStatus)) return MarketStatus.FINISHED;
    return MarketStatus.SUSPENDED;
  },

  getMockData(): BettingMarket[] {
    return [
      {
        id: 'mock-1',
        name: 'Real Madrid vs Barcelona',
        category: 'La Liga',
        startTime: new Date(),
        status: MarketStatus.LIVE,
        teams: [
          { name: 'Real Madrid', score: 2, odds: 1.85, logo: 'https://media.api-sports.io/football/teams/541.png' },
          { name: 'Barcelona', score: 1, odds: 3.20, logo: 'https://media.api-sports.io/football/teams/529.png' }
        ],
        drawOdds: 3.50,
        liveTime: '65\''
      }
    ];
  }
};
