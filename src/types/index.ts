export interface Team {
  id: string;
  name: string;
  flag: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export type StageType =
  | 'group'
  | 'round_32'
  | 'round_16'
  | 'quarter'
  | 'semi'
  | 'third_place'
  | 'final';

export interface Match {
  id: string;
  stage: StageType;
  group: string | null; // e.g., 'A' for group stage, null for knockout
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  homeTeamPlaceholder: string;
  awayTeamPlaceholder: string;
  homeScore: number | null;
  awayScore: number | null;
  homePenaltyScore: number | null;
  awayPenaltyScore: number | null;
  date: string;
  stadiumId: string;
  isCompleted: boolean;
  winnerId: string | null;
}

export interface Group {
  id: string; // 'A' to 'L'
  teams: Team[];
}

export interface Stadium {
  id: string;
  name: string;
  country: string;
}