import { type Team, type Match, type Group } from '../types/index';

export const getFlagUrl = (teamId: string): string => {
  return `https://api.fifa.com/api/v3/picture/flags-sq-4/${teamId}`;
};

// Format date and time into readable format (e.g., "11 jun 16:00")
export const formatDate = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  
  // Extract date components
  const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'short' });
  
  // Extract time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${dayOfWeek}, ${day} ${month} ${hours}:${minutes}`;
};

// Calculate standings for teams based on matches
export const calculateGroupStandings = (matches: Match[], initialTeams: Team[]): Team[] => {
  // Create a map to accumulate stats
  const teamStats: Record<string, Team> = {};

  // Initialize stats for each team
  initialTeams.forEach(team => {
    teamStats[team.id] = {
      ...team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  // Calculate stats based on matches
  matches.forEach(match => {
    if (match.stage !== 'group' || !match.isCompleted) return;
    if (match.homeScore === null || match.awayScore === null) return;
    if (!match.homeTeam || !match.awayTeam) return;

    const home = teamStats[match.homeTeam.id];
    const away = teamStats[match.awayTeam.id];

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }
  });

  // Recalculate goal difference and convert back to array
  const updatedTeams = Object.values(teamStats).map(t => ({
    ...t,
    goalDifference: t.goalsFor - t.goalsAgainst,
  }));

  // Sort: Points -> GD -> GF -> alphabetical
  return updatedTeams.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    return a.name.localeCompare(b.name);
  });
};

// Retrieve the 8 best 3rd placed teams across all groups
export const getBestThirdPlacedTeams = (groups: Group[]): Team[] => {
  const thirds: Team[] = [];

  groups.forEach(group => {
    if (group.teams.length >= 3) {
      // The 3rd placed team is index 2 after sorting standings
      thirds.push(group.teams[2]);
    }
  });

  // Sort thirds: Points -> GD -> GF -> alphabetical
  return thirds
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 8); // Top 8 third-placed teams qualify
};

// Setup initial round of 32 knockout matches based on group standings
export const propagateRoundOf32 = (groups: Group[], knockoutMatches: Match[]): Match[] => {
  // Find group standings
  const getWinner = (groupId: string): Team | null => {
    const group = groups.find(g => g.id === groupId);
    return group && group.teams.length > 0 ? group.teams[0] : null;
  };

  const getRunnerUp = (groupId: string): Team | null => {
    const group = groups.find(g => g.id === groupId);
    return group && group.teams.length > 1 ? group.teams[1] : null;
  };

  const bestThirds = getBestThirdPlacedTeams(groups);

  // Deep clone knockout matches
  const updatedKnockouts = knockoutMatches.map(m => ({ ...m }));

  // Helper to map teams into Round of 32 matches
  // Round of 32 has 16 matches: K1 to K16
  // K1: W_A vs T_1
  // K2: W_B vs T_2
  // K3: W_C vs T_3
  // K4: W_D vs T_4
  // K5: W_E vs T_5
  // K6: W_F vs T_6
  // K7: W_G vs T_7
  // K8: W_H vs T_8
  // K9: W_I vs R_A
  // K10: W_J vs R_B
  // K11: W_K vs R_C
  // K12: W_L vs R_D
  // K13: R_E vs R_F
  // K14: R_G vs R_H
  // K15: R_I vs R_J
  // K16: R_K vs R_L

  const r32Pairings: Record<
    string,
    {
      home: () => Team | null;
      away: () => Team | null;
      homePlaceholder: string;
      awayPlaceholder: string;
    }
  > = {
    K1: { home: () => getWinner('A'), away: () => bestThirds[0] || null, homePlaceholder: '1A', awayPlaceholder: '3º Place 1' },
    K2: { home: () => getWinner('B'), away: () => bestThirds[1] || null, homePlaceholder: '1B', awayPlaceholder: '3º Place 2' },
    K3: { home: () => getWinner('C'), away: () => bestThirds[2] || null, homePlaceholder: '1C', awayPlaceholder: '3º Place 3' },
    K4: { home: () => getWinner('D'), away: () => bestThirds[3] || null, homePlaceholder: '1D', awayPlaceholder: '3º Place 4' },
    K5: { home: () => getWinner('E'), away: () => bestThirds[4] || null, homePlaceholder: '1E', awayPlaceholder: '3º Place 5' },
    K6: { home: () => getWinner('F'), away: () => bestThirds[5] || null, homePlaceholder: '1F', awayPlaceholder: '3º Place 6' },
    K7: { home: () => getWinner('G'), away: () => bestThirds[6] || null, homePlaceholder: '1G', awayPlaceholder: '3º Place 7' },
    K8: { home: () => getWinner('H'), away: () => bestThirds[7] || null, homePlaceholder: '1H', awayPlaceholder: '3º Place 8' },
    K9: { home: () => getWinner('I'), away: () => getRunnerUp('A'), homePlaceholder: '1I', awayPlaceholder: '2A' },
    K10: { home: () => getWinner('J'), away: () => getRunnerUp('B'), homePlaceholder: '1J', awayPlaceholder: '2B' },
    K11: { home: () => getWinner('K'), away: () => getRunnerUp('C'), homePlaceholder: '1K', awayPlaceholder: '2C' },
    K12: { home: () => getWinner('L'), away: () => getRunnerUp('D'), homePlaceholder: '1L', awayPlaceholder: '2D' },
    K13: { home: () => getRunnerUp('E'), away: () => getRunnerUp('F'), homePlaceholder: '2E', awayPlaceholder: '2F' },
    K14: { home: () => getRunnerUp('G'), away: () => getRunnerUp('H'), homePlaceholder: '2G', awayPlaceholder: '2H' },
    K15: { home: () => getRunnerUp('I'), away: () => getRunnerUp('J'), homePlaceholder: '2I', awayPlaceholder: '2J' },
    K16: { home: () => getRunnerUp('K'), away: () => getRunnerUp('L'), homePlaceholder: '2K', awayPlaceholder: '2L' },
  };

  updatedKnockouts.forEach(match => {
    if (match.stage === 'round_32') {
      const pairing = r32Pairings[match.id];
      if (pairing) {
        match.homeTeam = pairing.home();
        match.awayTeam = pairing.away();
        match.homeTeamPlaceholder = pairing.homePlaceholder;
        match.awayTeamPlaceholder = pairing.awayPlaceholder;

        // Reset completion status if teams changed
        if (!match.homeTeam || !match.awayTeam) {
          match.homeScore = null;
          match.awayScore = null;
          match.homePenaltyScore = null;
          match.awayPenaltyScore = null;
          match.isCompleted = false;
          match.winnerId = null;
        }
      }
    }
  });

  return updatedKnockouts;
};

// Propagate subsequent knockout rounds based on results from previous stages
export const propagateKnockoutStages = (knockoutMatches: Match[]): Match[] => {
  const matchesMap = new Map<string, Match>();
  knockoutMatches.forEach(m => matchesMap.set(m.id, m));

  const getWinnerOfMatch = (matchId: string): Team | null => {
    const match = matchesMap.get(matchId);
    if (!match || !match.isCompleted || !match.winnerId) return null;
    return match.homeTeam?.id === match.winnerId ? match.homeTeam : match.awayTeam;
  };

  const getLoserOfMatch = (matchId: string): Team | null => {
    const match = matchesMap.get(matchId);
    if (!match || !match.isCompleted || !match.winnerId) return null;
    return match.homeTeam?.id === match.winnerId ? match.awayTeam : match.homeTeam;
  };

  // Node hierarchy:
  // Round of 16 (8 matches: K17 to K24)
  // K17: Winner K1 vs Winner K2
  // K18: Winner K3 vs Winner K4
  // K19: Winner K5 vs Winner K6
  // K20: Winner K7 vs Winner K8
  // K21: Winner K9 vs Winner K10
  // K22: Winner K11 vs Winner K12
  // K23: Winner K13 vs Winner K14
  // K24: Winner K15 vs Winner K16
  const r16Map: Record<string, [string, string]> = {
    K17: ['K1', 'K2'],
    K18: ['K3', 'K4'],
    K19: ['K5', 'K6'],
    K20: ['K7', 'K8'],
    K21: ['K9', 'K10'],
    K22: ['K11', 'K12'],
    K23: ['K13', 'K14'],
    K24: ['K15', 'K16'],
  };

  // Quarter Finals (4 matches: K25 to K28)
  // K25: Winner K17 vs Winner K18
  // K26: Winner K19 vs Winner K20
  // K27: Winner K21 vs Winner K22
  // K28: Winner K23 vs Winner K24
  const qfMap: Record<string, [string, string]> = {
    K25: ['K17', 'K18'],
    K26: ['K19', 'K20'],
    K27: ['K21', 'K22'],
    K28: ['K23', 'K24'],
  };

  // Semi Finals (2 matches: K29 to K30)
  // K29: Winner K25 vs Winner K26
  // K30: Winner K27 vs Winner K28
  const sfMap: Record<string, [string, string]> = {
    K29: ['K25', 'K26'],
    K30: ['K27', 'K28'],
  };

  // Third Place (K31)
  // K31: Loser K29 vs Loser K30
  // Final (K32)
  // K32: Winner K29 vs Winner K30

  // Propagate Round of 16
  Object.entries(r16Map).forEach(([targetId, [m1, m2]]) => {
    const match = matchesMap.get(targetId);
    if (match) {
      const prevHome = match.homeTeam;
      const prevAway = match.awayTeam;
      match.homeTeam = getWinnerOfMatch(m1);
      match.awayTeam = getWinnerOfMatch(m2);
      match.homeTeamPlaceholder = `Winner ${m1}`;
      match.awayTeamPlaceholder = `Winner ${m2}`;
      if (match.homeTeam !== prevHome || match.awayTeam !== prevAway) {
        // Reset match if teams changed
        match.homeScore = null;
        match.awayScore = null;
        match.homePenaltyScore = null;
        match.awayPenaltyScore = null;
        match.isCompleted = false;
        match.winnerId = null;
      }
    }
  });

  // Propagate Quarter Finals
  Object.entries(qfMap).forEach(([targetId, [m1, m2]]) => {
    const match = matchesMap.get(targetId);
    if (match) {
      const prevHome = match.homeTeam;
      const prevAway = match.awayTeam;
      match.homeTeam = getWinnerOfMatch(m1);
      match.awayTeam = getWinnerOfMatch(m2);
      match.homeTeamPlaceholder = `Winner ${m1}`;
      match.awayTeamPlaceholder = `Winner ${m2}`;
      if (match.homeTeam !== prevHome || match.awayTeam !== prevAway) {
        match.homeScore = null;
        match.awayScore = null;
        match.homePenaltyScore = null;
        match.awayPenaltyScore = null;
        match.isCompleted = false;
        match.winnerId = null;
      }
    }
  });

  // Propagate Semi Finals
  Object.entries(sfMap).forEach(([targetId, [m1, m2]]) => {
    const match = matchesMap.get(targetId);
    if (match) {
      const prevHome = match.homeTeam;
      const prevAway = match.awayTeam;
      match.homeTeam = getWinnerOfMatch(m1);
      match.awayTeam = getWinnerOfMatch(m2);
      match.homeTeamPlaceholder = `Winner ${m1}`;
      match.awayTeamPlaceholder = `Winner ${m2}`;
      if (match.homeTeam !== prevHome || match.awayTeam !== prevAway) {
        match.homeScore = null;
        match.awayScore = null;
        match.homePenaltyScore = null;
        match.awayPenaltyScore = null;
        match.isCompleted = false;
        match.winnerId = null;
      }
    }
  });

  // Propagate Third Place
  const thirdPlaceMatch = matchesMap.get('K31');
  if (thirdPlaceMatch) {
    const prevHome = thirdPlaceMatch.homeTeam;
    const prevAway = thirdPlaceMatch.awayTeam;
    thirdPlaceMatch.homeTeam = getLoserOfMatch('K29');
    thirdPlaceMatch.awayTeam = getLoserOfMatch('K30');
    thirdPlaceMatch.homeTeamPlaceholder = `Loser K29`;
    thirdPlaceMatch.awayTeamPlaceholder = `Loser K30`;
    if (thirdPlaceMatch.homeTeam !== prevHome || thirdPlaceMatch.awayTeam !== prevAway) {
      thirdPlaceMatch.homeScore = null;
      thirdPlaceMatch.awayScore = null;
      thirdPlaceMatch.homePenaltyScore = null;
      thirdPlaceMatch.awayPenaltyScore = null;
      thirdPlaceMatch.isCompleted = false;
      thirdPlaceMatch.winnerId = null;
    }
  }

  // Propagate Final
  const finalMatch = matchesMap.get('K32');
  if (finalMatch) {
    const prevHome = finalMatch.homeTeam;
    const prevAway = finalMatch.awayTeam;
    finalMatch.homeTeam = getWinnerOfMatch('K29');
    finalMatch.awayTeam = getWinnerOfMatch('K30');
    finalMatch.homeTeamPlaceholder = `Winner K29`;
    finalMatch.awayTeamPlaceholder = `Winner K30`;
    if (finalMatch.homeTeam !== prevHome || finalMatch.awayTeam !== prevAway) {
      finalMatch.homeScore = null;
      finalMatch.awayScore = null;
      finalMatch.homePenaltyScore = null;
      finalMatch.awayPenaltyScore = null;
      finalMatch.isCompleted = false;
      finalMatch.winnerId = null;
    }
  }

  return Array.from(matchesMap.values());
};
