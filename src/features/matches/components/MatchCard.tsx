import React from 'react';
import type { Match} from '../../../types';
import { useFixture } from '../../../context/useFixture';
import { Card } from '../../../components/Card';
import { getFlagUrl, formatDate, getTeamName, getStageLabelEs } from '../../../utils/helpers';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { updateMatchScore, stadiums } = useFixture();
  
  // Reutilizable team names
  const homeTeamName = getTeamName(match.homeTeam, match.homeTeamPlaceholder);
  const awayTeamName = getTeamName(match.awayTeam, match.awayTeamPlaceholder);
  
  // Check if teams are ready for input
  const teamsReady = match.homeTeam && match.awayTeam;
  
  // Winner flags
  const homeIsWinner = match.winnerId === match.homeTeam?.id && match.winnerId !== null;
  const awayIsWinner = match.winnerId === match.awayTeam?.id && match.winnerId !== null;

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const homeScore = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(match.id, homeScore, match.awayScore, match.homePenaltyScore, match.awayPenaltyScore, match.winnerId);
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const awayScore = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(match.id, match.homeScore, awayScore, match.homePenaltyScore, match.awayPenaltyScore, match.winnerId);
  };
  
  const stadium = stadiums.find(s => s.id === match.stadiumId)?.name || "Estadio no asignado";

  return (
    <Card className={`match-card ${match.isCompleted ? 'match-completed' : ''}`}>
      <div className="match-card-header">
        <span className="match-stage-badge">
          {match.stage === 'group' ? `Grupo ${match.group}` : getStageLabelEs(match.stage)}
        </span>
        <span className="match-id">{match.id}</span>
      </div>
      <div className="match-teams-container">
        {/* Home Team */}
        <div className={`match-team-block ${homeIsWinner ? 'match-winner' : ''}`}>
          <div className="team-info">
            {match.homeTeam ? (
              <img className="team-flag-large-img" src={getFlagUrl(match.homeTeam.flag)} alt={`${match.homeTeam.name} flag`} />
            ) : (
              <span className="team-flag-large-placeholder">❓</span>
            )}
            <span className="team-name-text">{homeTeamName}</span>
          </div>
          <input
            type="number"
            min="0"
            className="score-input"
            placeholder="-"
            disabled={match.isCompleted || !teamsReady}
            value={match.homeScore != null ? match.homeScore : ''}
            onChange={handleHomeScoreChange}
          />
        </div>
        {/* VS Divider */}
        <div className="match-vs-divider-row"><span>VS</span></div>
        {/* Away Team */}
        <div className={`match-team-block away-block ${awayIsWinner ? 'match-winner' : ''}`}>
          <input
            type="number"
            min="0"
            className="score-input"
            placeholder="-"
            disabled={match.isCompleted || !teamsReady}
            value={match.awayScore != null ? match.awayScore : ''}
            onChange={handleAwayScoreChange}
          />
          <div className="team-info">
            {match.awayTeam ? (
              <img className="team-flag-large-img" src={getFlagUrl(match.awayTeam.flag)} alt={`${match.awayTeam.name} flag`} />
            ) : (
              <span className="team-flag-large-placeholder">❓</span>
            )}
            <span className="team-name-text">{awayTeamName}</span>
          </div>
        </div>
      </div>

      {/* Match Card Footer */}
      <div className="match-card-footer">
        <span className="match-stadium">{stadium}</span>
        <span className="match-date">{formatDate(match.date)}</span>
      </div>
    </Card>
  );
};