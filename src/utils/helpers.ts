import { type Team, type Match } from '../types/index';
import type { StageType } from '../types/index';

// API Match type before normalization
export interface ApiMatch {
  id: string;
  homeTeamId?: string;
  home_team_id?: string;
  awayTeamId?: string;
  away_team_id?: string;
  stage?: string;
  group?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homePenaltyScore?: number | null;
  awayPenaltyScore?: number | null;
  isCompleted?: boolean;
  winnerId?: string | null;
  date?: string;
  stadiumId?: string;
}

export const getFlagUrl = (teamId: string): string => {
  return `https://api.fifa.com/api/v3/picture/flags-sq-4/${teamId}`;
};

// Get readable label for stage type
export const getStageLabelEs = (stage: StageType): string => {
  const labels: Record<StageType, string> = {
    group: 'Fase de Grupos',
    round_32: 'Dieciseisavos de Final (32)',
    round_16: 'Octavos de Final',
    quarter: 'Cuartos de Final',
    semi: 'Semifinal',
    third_place: 'Tercer Puesto',
    final: 'Gran Final',
  };
  return labels[stage] || '';
};

// Reusable comparator for FIFA standings criteria (Points -> GD -> GF -> name)
export const compareTeamsStandings = (a: Team, b: Team): number => {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.name.localeCompare(b.name);
};

// Helper to normalize API match data into Match interface
export const normalizeMatch = (apiMatch: ApiMatch, teamsMap: Map<string, Team>): Match => {
  const homeTeamId = apiMatch.homeTeamId || apiMatch.home_team_id || '';
  const awayTeamId = apiMatch.awayTeamId || apiMatch.away_team_id || '';
  const stageValue = apiMatch.stage?.toLowerCase() || 'group';
  const validStages: StageType[] = ['group', 'round_32', 'round_16', 'quarter', 'semi', 'third_place', 'final'];
  const stage = validStages.includes(stageValue as StageType) ? (stageValue as StageType) : 'group';
  
  return {
    id: apiMatch.id || '',
    stage,
    group: apiMatch.group ? apiMatch.group.toUpperCase() : null,
    homeTeamId,
    awayTeamId,
    homeTeam: homeTeamId ? teamsMap.get(homeTeamId) || null : null,
    awayTeam: awayTeamId ? teamsMap.get(awayTeamId) || null : null,
    homeTeamPlaceholder: '',
    awayTeamPlaceholder: '',
    homeScore: apiMatch.homeScore || null,
    awayScore: apiMatch.awayScore || null,
    homePenaltyScore: apiMatch.homePenaltyScore || null,
    awayPenaltyScore: apiMatch.awayPenaltyScore || null,
    date: apiMatch.date || '',
    stadiumId: apiMatch.stadiumId || '',
    isCompleted: apiMatch.isCompleted || false,
    winnerId: apiMatch.winnerId || null,
  };
};

// Helper to get team name from a match, falling back to placeholder
export const getTeamName = (team: Team | null | undefined, placeholder: string): string => {
  return team?.name || placeholder;
};

const weekdayFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });

// Format date and time into readable format (e.g., "11 jun 16:00")
export const formatDate = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  
  // Extract date components using cached formatters
  const dayOfWeek = weekdayFormatter.format(date);
  const day = date.getDate();
  const month = monthFormatter.format(date);
  
  // Extract time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${dayOfWeek}, ${day} ${month} ${hours}:${minutes}`;
};
