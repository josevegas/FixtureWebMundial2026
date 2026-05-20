import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Team, Match, Group, StageType } from '../types';
import {
  calculateGroupStandings,
  propagateRoundOf32,
  propagateKnockoutStages,
} from '../utils/helpers';

interface FixtureContextType {
  teams: Team[];
  matches: Match[];
  groups: Group[];
  updateMatchScore: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    homePenaltyScore?: number | null,
    awayPenaltyScore?: number | null,
    winnerId?: string | null
  ) => void;
  simulateAllGroupStage: () => void;
  simulateAllTournament: () => void;
  resetFixture: () => void;
}

const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

// Initial list of 48 teams divided into 12 groups (A to L)
const initialTeamsData: Team[] = [
  // Group A
  { id: 'USA', name: 'Estados Unidos', flag: '🇺🇸', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SUI', name: 'Suiza', flag: '🇨🇭', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CMR', name: 'Camerún', flag: '🇨🇲', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'JAM', name: 'Jamaica', flag: '🇯🇲', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group B
  { id: 'MEX', name: 'México', flag: '🇲🇽', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'POL', name: 'Polonia', flag: '🇵🇱', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group C
  { id: 'CAN', name: 'Canadá', flag: '🇨🇦', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'DEN', name: 'Dinamarca', flag: '🇩🇰', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'EGY', name: 'Egipto', flag: '🇪🇬', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'IRQ', name: 'Irak', flag: '🇮🇶', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group D
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SWE', name: 'Suecia', flag: '🇸🇪', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'NGA', name: 'Nigeria', flag: '🇳🇬', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'PAN', name: 'Panamá', flag: '🇵🇦', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group E
  { id: 'FRA', name: 'Francia', flag: '🇫🇷', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'UZB', name: 'Uzbekistán', flag: '🇺🇿', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group F
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'TUR', name: 'Turquía', flag: '🇹🇷', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'HON', name: 'Honduras', flag: '🇭🇳', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group G
  { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'TUN', name: 'Túnez', flag: '🇹🇳', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group H
  { id: 'BEL', name: 'Bélgica', flag: '🇧🇪', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CRO', name: 'Croacia', flag: '🇭🇷', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'ALG', name: 'Argelia', flag: '🇩🇿', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group I
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CHI', name: 'Chile', flag: '🇨🇱', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'MLI', name: 'Mali', flag: '🇲🇱', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group J
  { id: 'ESP', name: 'España', flag: '🇪🇸', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CRC', name: 'Costa Rica', flag: '🇨🇷', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'IRN', name: 'Irán', flag: '🇮🇷', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group K
  { id: 'ITA', name: 'Italia', flag: '🇮🇹', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'PER', name: 'Perú', flag: '🇵🇪', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'JPN', name: 'Japón', flag: '🇯🇵', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  // Group L
  { id: 'GER', name: 'Alemania', flag: '🇩🇪', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'NED', name: 'Países Bajos', flag: '🇳🇱', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'MAR', name: 'Marruecos', flag: '🇲🇦', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'UKR', name: 'Ucrania', flag: '🇺🇦', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
];

const stadiumsList = [
  'MetLife Stadium, East Rutherford',
  'SoFi Stadium, Inglewood',
  'AT&T Stadium, Arlington',
  'Arrowhead Stadium, Kansas City',
  'NRG Stadium, Houston',
  'Mercedes-Benz Stadium, Atlanta',
  'Lincoln Financial Field, Philadelphia',
  'Lumen Field, Seattle',
  'Levi\'s Stadium, Santa Clara',
  'Gillette Stadium, Foxborough',
  'Hard Rock Stadium, Miami Gardens',
  'BC Place, Vancouver',
  'BMO Field, Toronto',
  'Estadio Azteca, Ciudad de México',
  'Estadio BBVA, Monterrey',
  'Estadio Akron, Guadalajara',
];

// Generate Group Matches Programmatically
const generateGroupMatches = (teams: Team[]): Match[] => {
  const matches: Match[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  let matchCounter = 1;

  // Let's spread dates from June 11 to June 27
  const startDate = new Date('2026-06-11');

  groups.forEach((groupId, groupIdx) => {
    const groupTeams = teams.filter(t => t.group === groupId);
    if (groupTeams.length !== 4) return;

    // 3 Rounds for 4 teams:
    // Round 1: 0-1, 2-3
    // Round 2: 0-2, 1-3
    // Round 3: 0-3, 1-2
    const roundRobin = [
      [groupTeams[0], groupTeams[1], groupTeams[2], groupTeams[3]],
      [groupTeams[0], groupTeams[2], groupTeams[1], groupTeams[3]],
      [groupTeams[0], groupTeams[3], groupTeams[1], groupTeams[2]],
    ];

    roundRobin.forEach((round, roundIdx) => {
      // Calculate date based on group and round
      const dateOffset = roundIdx * 5 + Math.floor(groupIdx / 3);
      const matchDate = new Date(startDate);
      matchDate.setDate(startDate.getDate() + dateOffset);
      const dateStr = matchDate.toISOString().split('T')[0];

      // Match 1 of round
      matches.push({
        id: `G${matchCounter++}`,
        stage: 'group',
        group: groupId,
        homeTeam: round[0],
        awayTeam: round[1],
        homeTeamPlaceholder: null,
        awayTeamPlaceholder: null,
        homeScore: null,
        awayScore: null,
        date: dateStr,
        stadium: stadiumsList[Math.floor(Math.random() * stadiumsList.length)],
        isCompleted: false,
        winnerId: null,
      });

      // Match 2 of round
      matches.push({
        id: `G${matchCounter++}`,
        stage: 'group',
        group: groupId,
        homeTeam: round[2],
        awayTeam: round[3],
        homeTeamPlaceholder: null,
        awayTeamPlaceholder: null,
        homeScore: null,
        awayScore: null,
        date: dateStr,
        stadium: stadiumsList[Math.floor(Math.random() * stadiumsList.length)],
        isCompleted: false,
        winnerId: null,
      });
    });
  });

  return matches;
};

// Generate Knockout matches skeletons (32 matches total)
const generateKnockoutMatches = (): Match[] => {
  const matches: Match[] = [];

  const addMatch = (
    id: string,
    stage: StageType,
    dateStr: string,
    stadium: string,
    homePlaceholder: string,
    awayPlaceholder: string
  ) => {
    matches.push({
      id,
      stage,
      group: null,
      homeTeam: null,
      awayTeam: null,
      homeTeamPlaceholder: homePlaceholder,
      awayTeamPlaceholder: awayPlaceholder,
      homeScore: null,
      awayScore: null,
      homePenaltyScore: null,
      awayPenaltyScore: null,
      date: dateStr,
      stadium,
      isCompleted: false,
      winnerId: null,
    });
  };

  // Round of 32 (Matches K1 to K16) - June 28 to July 3, 2026
  addMatch('K1', 'round_32', '2026-06-28', stadiumsList[0], '1A', '3º Place 1');
  addMatch('K2', 'round_32', '2026-06-28', stadiumsList[1], '1B', '3º Place 2');
  addMatch('K3', 'round_32', '2026-06-29', stadiumsList[2], '1C', '3º Place 3');
  addMatch('K4', 'round_32', '2026-06-29', stadiumsList[3], '1D', '3º Place 4');
  addMatch('K5', 'round_32', '2026-06-30', stadiumsList[4], '1E', '3º Place 5');
  addMatch('K6', 'round_32', '2026-06-30', stadiumsList[5], '1F', '3º Place 6');
  addMatch('K7', 'round_32', '2026-07-01', stadiumsList[6], '1G', '3º Place 7');
  addMatch('K8', 'round_32', '2026-07-01', stadiumsList[7], '1H', '3º Place 8');
  addMatch('K9', 'round_32', '2026-07-02', stadiumsList[8], '1I', '2A');
  addMatch('K10', 'round_32', '2026-07-02', stadiumsList[9], '1J', '2B');
  addMatch('K11', 'round_32', '2026-07-03', stadiumsList[10], '1K', '2C');
  addMatch('K12', 'round_32', '2026-07-03', stadiumsList[11], '1L', '2D');
  addMatch('K13', 'round_32', '2026-06-28', stadiumsList[12], '2E', '2F');
  addMatch('K14', 'round_32', '2026-06-29', stadiumsList[13], '2G', '2H');
  addMatch('K15', 'round_32', '2026-06-30', stadiumsList[14], '2I', '2J');
  addMatch('K16', 'round_32', '2026-07-01', stadiumsList[15], '2K', '2L');

  // Round of 16 (Matches K17 to K24) - July 4 to July 7, 2026
  addMatch('K17', 'round_16', '2026-07-04', stadiumsList[0], 'Ganador K1', 'Ganador K2');
  addMatch('K18', 'round_16', '2026-07-04', stadiumsList[1], 'Ganador K3', 'Ganador K4');
  addMatch('K19', 'round_16', '2026-07-05', stadiumsList[2], 'Ganador K5', 'Ganador K6');
  addMatch('K20', 'round_16', '2026-07-05', stadiumsList[3], 'Ganador K7', 'Ganador K8');
  addMatch('K21', 'round_16', '2026-07-06', stadiumsList[4], 'Ganador K9', 'Ganador K10');
  addMatch('K22', 'round_16', '2026-07-06', stadiumsList[5], 'Ganador K11', 'Ganador K12');
  addMatch('K23', 'round_16', '2026-07-07', stadiumsList[6], 'Ganador K13', 'Ganador K14');
  addMatch('K24', 'round_16', '2026-07-07', stadiumsList[7], 'Ganador K15', 'Ganador K16');

  // Quarter Finals (Matches K25 to K28) - July 9 to July 11, 2026
  addMatch('K25', 'quarter', '2026-07-09', stadiumsList[8], 'Ganador K17', 'Ganador K18');
  addMatch('K26', 'quarter', '2026-07-10', stadiumsList[9], 'Ganador K19', 'Ganador K20');
  addMatch('K27', 'quarter', '2026-07-11', stadiumsList[10], 'Ganador K21', 'Ganador K22');
  addMatch('K28', 'quarter', '2026-07-11', stadiumsList[11], 'Ganador K23', 'Ganador K24');

  // Semi Finals (Matches K29 to K30) - July 14 and July 15, 2026
  addMatch('K29', 'semi', '2026-07-14', stadiumsList[12], 'Ganador K25', 'Ganador K26');
  addMatch('K30', 'semi', '2026-07-15', stadiumsList[13], 'Ganador K27', 'Ganador K28');

  // Third Place (Match K31) - July 18, 2026
  addMatch('K31', 'third_place', '2026-07-18', stadiumsList[14], 'Perdedor K29', 'Perdedor K30');

  // Final (Match K32) - July 19, 2026
  addMatch('K32', 'final', '2026-07-19', stadiumsList[15], 'Ganador K29', 'Ganador K30');

  return matches;
};

export const FixtureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const teams = initialTeamsData;
  const [matches, setMatches] = useState<Match[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Initialize data on mount
  useEffect(() => {
    const groupMatches = generateGroupMatches(initialTeamsData);
    const knockoutMatches = generateKnockoutMatches();
    const allMatches = [...groupMatches, ...knockoutMatches];

    setMatches(allMatches);

    // Initial group calculation
    const initialGroups = calculateGroups(allMatches, initialTeamsData);
    setGroups(initialGroups);
  }, []);

  const calculateGroups = (allMatches: Match[], currentTeams: Team[]): Group[] => {
    const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const groupMatches = allMatches.filter(m => m.stage === 'group');

    return groupIds.map(gid => {
      const gTeams = currentTeams.filter(t => t.group === gid);
      const computed = calculateGroupStandings(groupMatches, gTeams);
      return {
        id: gid,
        teams: computed,
      };
    });
  };

  // Main score update logic
  const updateMatchScore = (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    homePenaltyScore: number | null = null,
    awayPenaltyScore: number | null = null,
    winnerId: string | null = null
  ) => {
    setMatches(prevMatches => {
      // Find and update target match
      const updatedMatches = prevMatches.map(m => {
        if (m.id !== matchId) return m;

        const isCompleted = homeScore !== null && awayScore !== null;
        let finalWinnerId = winnerId;

        // Auto-resolve winner if completed
        if (isCompleted && homeScore !== null && awayScore !== null) {
          if (m.stage === 'group') {
            finalWinnerId = null; // No winnerId needed in group stage
          } else {
            // Knockout stages
            if (homeScore > awayScore) {
              finalWinnerId = m.homeTeam?.id || null;
            } else if (awayScore > homeScore) {
              finalWinnerId = m.awayTeam?.id || null;
            } else {
              // Draw in knockout requires penalties
              if (homePenaltyScore !== null && awayPenaltyScore !== null) {
                finalWinnerId = homePenaltyScore > awayPenaltyScore ? m.homeTeam?.id || null : m.awayTeam?.id || null;
              } else {
                finalWinnerId = winnerId || m.homeTeam?.id || null; // Fallback to provided winner or home
              }
            }
          }
        } else {
          finalWinnerId = null;
        }

        return {
          ...m,
          homeScore,
          awayScore,
          homePenaltyScore,
          awayPenaltyScore,
          isCompleted,
          winnerId: finalWinnerId,
        };
      });

      // Recalculate group standings and update groups list
      const freshGroups = calculateGroups(updatedMatches, teams);
      
      // Propagate Round of 32
      let propagatedMatches = propagateRoundOf32(freshGroups, updatedMatches);

      // Propagate all other knockout stages (Round of 16, Quarters, Semis, Finals)
      propagatedMatches = propagateKnockoutStages(propagatedMatches);

      // Update groups asynchronously (via state update)
      setGroups(freshGroups);

      return propagatedMatches;
    });
  };

  // Simulate group stage matches randomly
  const simulateAllGroupStage = () => {
    setMatches(prevMatches => {
      const updatedMatches = prevMatches.map(m => {
        if (m.stage !== 'group') return m;
        // Generate random realistic score
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 4);
        return {
          ...m,
          homeScore,
          awayScore,
          isCompleted: true,
          winnerId: null,
        };
      });

      const freshGroups = calculateGroups(updatedMatches, teams);
      let propagatedMatches = propagateRoundOf32(freshGroups, updatedMatches);
      propagatedMatches = propagateKnockoutStages(propagatedMatches);

      setGroups(freshGroups);
      return propagatedMatches;
    });
  };

  // Simulate all matches including knockout stages chronologically
  const simulateAllTournament = () => {
    // 1. First simulate all group stage matches
    setMatches(prevMatches => {
      let updatedMatches: Match[] = prevMatches.map(m => {
        if (m.stage !== 'group') {
          // Reset knockout match scores
          return {
            ...m,
            homeScore: null,
            awayScore: null,
            homePenaltyScore: null,
            awayPenaltyScore: null,
            isCompleted: false,
            winnerId: null,
          };
        }
        return {
          ...m,
          homeScore: Math.floor(Math.random() * 4),
          awayScore: Math.floor(Math.random() * 4),
          isCompleted: true,
          winnerId: null,
        };
      });

      // Recalculate groups and Round of 32
      let freshGroups = calculateGroups(updatedMatches, teams);
      updatedMatches = propagateRoundOf32(freshGroups, updatedMatches);
      updatedMatches = propagateKnockoutStages(updatedMatches);

      // 2. Now simulate each knockout round sequentially: round_32, round_16, quarter, semi, third_place & final
      const stages: StageType[] = ['round_32', 'round_16', 'quarter', 'semi', 'third_place', 'final'];

      stages.forEach(stage => {
        // Find matches in this stage and simulate them
        updatedMatches = updatedMatches.map(m => {
          if (m.stage !== stage) return m;
          if (!m.homeTeam || !m.awayTeam) return m; // Cannot simulate if teams aren't decided

          const homeScore = Math.floor(Math.random() * 4);
          const awayScore = Math.floor(Math.random() * 4);
          let winnerId = null;
          let homePenaltyScore = null;
          let awayPenaltyScore = null;

          if (homeScore > awayScore) {
            winnerId = m.homeTeam.id;
          } else if (awayScore > homeScore) {
            winnerId = m.awayTeam.id;
          } else {
            // Draw: simulate penalties
            homePenaltyScore = Math.floor(Math.random() * 5) + 3;
            awayPenaltyScore = homePenaltyScore + (Math.random() > 0.5 ? 1 : -1);
            if (awayPenaltyScore < 0) awayPenaltyScore = 0;
            winnerId = homePenaltyScore > awayPenaltyScore ? m.homeTeam.id : m.awayTeam.id;
          }

          return {
            ...m,
            homeScore,
            awayScore,
            homePenaltyScore,
            awayPenaltyScore,
            isCompleted: true,
            winnerId,
          };
        });

        // Re-propagate after simulating the stage
        updatedMatches = propagateKnockoutStages(updatedMatches);
      });

      // Set final group listings
      setGroups(freshGroups);

      return updatedMatches;
    });
  };

  // Reset all match results
  const resetFixture = () => {
    setMatches(prevMatches => {
      const reset = prevMatches.map(m => ({
        ...m,
        homeScore: null,
        awayScore: null,
        homePenaltyScore: null,
        awayPenaltyScore: null,
        isCompleted: false,
        winnerId: null,
        homeTeam: m.stage === 'group' ? m.homeTeam : null,
        awayTeam: m.stage === 'group' ? m.awayTeam : null,
      }));

      const freshGroups = calculateGroups(reset, teams);
      setGroups(freshGroups);

      return reset;
    });
  };

  return (
    <FixtureContext.Provider
      value={{
        teams,
        matches,
        groups,
        updateMatchScore,
        simulateAllGroupStage,
        simulateAllTournament,
        resetFixture,
      }}
    >
      {children}
    </FixtureContext.Provider>
  );
};

export const useFixture = () => {
  const context = useContext(FixtureContext);
  if (context === undefined) {
    throw new Error('useFixture must be used within a FixtureProvider');
  }
  return context;
};
