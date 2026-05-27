import React from 'react';
import type { Match} from '../../../types';
import { useFixture } from '../../../context/FixtureContext';
import { Card } from '../../../components/Card';
import { getFlagUrl, formatDate } from '../../../utils/helpers';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { updateMatchScore } = useFixture();

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

  const handleHomePenaltyScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const homePenaltyScore = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(match.id, match.homeScore, match.awayScore, homePenaltyScore, match.awayPenaltyScore, match.winnerId);
  };

  const handleAwayPenaltyScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const awayPenaltyScore = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(match.id, match.homeScore, match.awayScore, match.homePenaltyScore, awayPenaltyScore, match.winnerId);
  };

  const getStageLabel = () => {
    if (match.stage === 'group') return `Grupo ${match.group}`;
    switch (match.stage) {
      case 'round_32':
        return 'Dieciseisavos de Final (32)';
      case 'round_16':
        return 'Octavos de Final';
      case 'quarter':
        return 'Cuartos de Final';
      case 'semi':
        return 'Semifinal';
      case 'third_place':
        return 'Tercer Puesto';
      case 'final':
        return 'Gran Final';
      default:
        return '';
    }
  };

  return (
    <Card className={`match-card ${match.isCompleted ? 'match-completed' : ''}`}>
      <div className="match-card-header">
        <span className="match-stage-badge">{getStageLabel()}</span>
        <span className="match-id">{match.id}</span>
      </div>
      <div className="match-teams-container">
        {/* Home Team */}
        <div className={`match-team-block${match.winnerId === match.homeTeam?.id && match.winnerId !== null ? 'match-winner' : ''}`}>
          <div className="team-info">
            {match.homeTeam?(
              <img className="team-flag-large-img" src={getFlagUrl(match.homeTeam.flag)} alt={`${match.homeTeam.name} flag`} />
            ):(
              <span className="team-flag-large-placeholder">❓</span>
            )}
            <span className="team-name-text">
              {match.homeTeam ? match.homeTeam.name : match.homeTeamPlaceholder}
            </span>
          </div>
          <input
            type="number"
            min="0"
            className="score-input"
            placeholder="-"
            disabled={!match.homeTeam || !match.awayTeam}
            value={match.homeScore != null ? match.homeScore: ''}
            onChange={handleHomeScoreChange}
          />
        </div>
        {/*Separador*/}
        <div className="match-vs-divider-row"><span>VS</span></div>
        {/* Away Team */}
        <div className={`match-team-block away-block ${match.winnerId === match.awayTeam?.id && match.winnerId !== null ? 'match-winner' : ''}`}>
          <input
            type="number"
            min="0"
            className="score-input"
            placeholder="-"
            disabled={!match.homeTeam || !match.awayTeam}
            value={match.awayScore != null ? match.awayScore : ''}
            onChange={handleAwayScoreChange}
          />
          <div className="team-info">
            {match.awayTeam?(
              <img className="team-flag-large-img" src={getFlagUrl(match.awayTeam.flag)} alt={`${match.awayTeam.name} flag`} />
            ):(
              <span className="team-flag-large-placeholder">❓</span>
            )}
            <span className="team-name-text">
              {match.awayTeam ? match.awayTeam.name : match.awayTeamPlaceholder}
            </span>
          </div>
        </div>
      </div>

      {/* Penalty Inputs (only show if match is completed and it's a knockout stage) */}

      {/*Estadios y fecha*/}
      <div className="march-card-footer">
        <span className="match-stadium">{match.stadium}</span>
        <br />
        <span className="match-date">{formatDate(match.date)}</span>
      </div>
    </Card>
  );
};