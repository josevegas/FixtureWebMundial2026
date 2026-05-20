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
  homeTeam: Team | null; // null if not yet determined in knockout stage
  awayTeam: Team | null; // null if not yet determined in knockout stage
  homeTeamPlaceholder: string | null; // e.g., "Winner Group A", "1A"
  awayTeamPlaceholder: string | null; // e.g., "Runner-up Group B", "2B"
  homeScore: number | null;
  awayScore: number | null;
  homePenaltyScore?: number | null;
  awayPenaltyScore?: number | null;
  date: string;
  stadium: string;
  isCompleted: boolean;
  winnerId: string | null; // Needed for knockout draw resolution (penalties)
}

export interface Group {
  id: string; // 'A' to 'L'
  teams: Team[];
}
