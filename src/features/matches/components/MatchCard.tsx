import React from 'react';
import type { Match } from '../../../types';
import { useFixture } from '../../../context/FixtureContext';
import { Card } from '../../../components/Card';
import { formatDate, getFlagUrl } from '../../../utils/helpers';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { updateMatchScore } = useFixture();

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const score = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(
      match.id,
      score,
      match.awayScore,
      match.homePenaltyScore,
      match.awayPenaltyScore,
      match.winnerId
    );
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const score = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(
      match.id,
      match.homeScore,
      score,
      match.homePenaltyScore,
      match.awayPenaltyScore,
      match.winnerId
    );
  };

  const handleHomePenaltyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const penalty = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(
      match.id,
      match.homeScore,
      match.awayScore,
      penalty,
      match.awayPenaltyScore,
      match.winnerId
    );
  };

  const handleAwayPenaltyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const penalty = val === '' ? null : Math.max(0, parseInt(val, 10));
    updateMatchScore(
      match.id,
      match.homeScore,
      match.awayScore,
      match.homePenaltyScore,
      penalty,
      match.winnerId
    );
  };

  const selectWinner = (teamId: string) => {
    updateMatchScore(
      match.id,
      match.homeScore,
      match.awayScore,
      match.homePenaltyScore,
      match.awayPenaltyScore,
      teamId
    );
  };

  const isTied =
    match.isCompleted &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore === match.awayScore;

  const isKnockout = match.stage !== 'group';

  // Format stage label
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
        <div className={`match-team-row ${match.winnerId === match.homeTeam?.id && match.winnerId !== null ? 'match-winner' : ''}`}>
          <div className="team-info">
            {match.homeTeam ? (
              <img className="team-flag-large-img" src={getFlagUrl(match.homeTeam.id)} alt={match.homeTeam.name} />
            ) : (
              <span className="team-flag-large-placeholder">❓</span>
            )}
            <span className="team-name-text">
              {match.homeTeam ? match.homeTeam.name : match.homeTeamPlaceholder || 'Por definir'}
            </span>
          </div>
          <input
            type="number"
            min="0"
            className="score-input"
            placeholder="-"
            disabled={!match.homeTeam || !match.awayTeam}
            value={match.homeScore !== null ? match.homeScore : ''}
            onChange={handleHomeScoreChange}
          />
        </div>

        {/* Separator / VS */}
        <div className="match-vs-divider">
          <span>VS</span>
        </div>

        {/* Away Team */}
        <div className={`match-team-row ${match.winnerId === match.awayTeam?.id && match.winnerId !== null ? 'match-winner' : ''}`}>
          <div className="team-info">
            {match.awayTeam ? (
              <img className="team-flag-large-img" src={getFlagUrl(match.awayTeam.id)} alt={match.awayTeam.name} />
            ) : (
              <span className="team-flag-large-placeholder">❓</span>
            )}
            <span className="team-name-text">
              {match.awayTeam ? match.awayTeam.name : match.awayTeamPlaceholder || 'Por definir'}
            </span>
          </div>
          <input
            type="number"
            min="0"
            className="score-input"
            placeholder="-"
            disabled={!match.homeTeam || !match.awayTeam}
            value={match.awayScore !== null ? match.awayScore : ''}
            onChange={handleAwayScoreChange}
          />
        </div>
      </div>

      {/* Penalty shootout section for knockouts */}
      {isKnockout && isTied && match.homeTeam && match.awayTeam && (
        <div className="penalty-shootout-section">
          <span className="penalty-title">Tanda de Penaltis</span>
          <div className="penalty-inputs">
            <input
              type="number"
              min="0"
              className="penalty-input"
              placeholder="Pk"
              value={match.homePenaltyScore !== null ? match.homePenaltyScore : ''}
              onChange={handleHomePenaltyChange}
            />
            <span className="penalty-dash">-</span>
            <input
              type="number"
              min="0"
              className="penalty-input"
              placeholder="Pk"
              value={match.awayPenaltyScore !== null ? match.awayPenaltyScore : ''}
              onChange={handleAwayPenaltyChange}
            />
          </div>
          {match.homePenaltyScore === match.awayPenaltyScore && (
            <div className="manual-winner-select">
              <span className="winner-select-label">Selecciona ganador:</span>
              <div className="winner-buttons">
                <button
                  type="button"
                  className={`btn-winner-pick ${match.winnerId === match.homeTeam.id ? 'active' : ''}`}
                  onClick={() => selectWinner(match.homeTeam!.id)}
                >
                  {match.homeTeam.name}
                </button>
                <button
                  type="button"
                  className={`btn-winner-pick ${match.winnerId === match.awayTeam.id ? 'active' : ''}`}
                  onClick={() => selectWinner(match.awayTeam!.id)}
                >
                  {match.awayTeam.name}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="match-card-footer">
        <span className="match-stadium">{match.stadium}</span>
        <span className="match-date">{formatDate(match.date)}</span>
      </div>
    </Card>
  );
};
