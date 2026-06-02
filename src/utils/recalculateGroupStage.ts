import type { Team, Match } from '../types/index';

export function recalculateGroupStage(baseTeams: Team[], currentMatches: Match[]): Team[] {
  // Clonamos los equipos para resetear estadísticas
  const teamsMap = new Map(baseTeams.map(t => [t.id, { ...t, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }]));

  currentMatches.forEach(m => {
    if (m.stage !== 'group' || m.homeScore === null || m.awayScore === null || m.homeScore === undefined || m.awayScore === undefined) return;
    
    const home = teamsMap.get(m.homeTeamId);
    const away = teamsMap.get(m.awayTeamId);

    if (home && away) {
      home.played += 1;
      away.played += 1;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (m.homeScore < m.awayScore) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        home.points += 1;
        away.drawn += 1;
        away.points += 1;
      }
      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    }
  });

  return Array.from(teamsMap.values());
}
