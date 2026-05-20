import React from 'react';
import { useFixture } from '../../../context/FixtureContext';
import type { Match, Team } from '../../../types';
import { formatDate, getFlagUrl } from '../../../utils/helpers';

export const KnockoutStage: React.FC = () => {
  const { matches, updateMatchScore } = useFixture();

  const getMatchesByStage = (stage: string) => {
    return matches.filter(m => m.stage === stage);
  };

  const r32Matches = getMatchesByStage('round_32');
  const r16Matches = getMatchesByStage('round_16');
  const qfMatches = getMatchesByStage('quarter');
  const sfMatches = getMatchesByStage('semi');
  const finalMatch = matches.find(m => m.id === 'K32');
  const thirdPlaceMatch = matches.find(m => m.id === 'K31');

  return (
    <div className="bracket-screen-wrapper">
      <div className="bracket-legend">
        <span className="legend-item"><span className="legend-dot green"></span> Clasifica</span>
        <span className="legend-item"><span className="legend-dot gold"></span> Campeón</span>
        <span className="legend-item">Desplázate horizontalmente para ver la fase final →</span>
      </div>

      <div className="bracket-scroll-container">
        {/* ROUND OF 32 */}
        <div className="bracket-column r32-column">
          <h4 className="column-title">Ronda de 32</h4>
          <div className="bracket-matches-list">
            {r32Matches.map(m => (
              <BracketMatchNode key={m.id} match={m} onUpdateScore={updateMatchScore} />
            ))}
          </div>
        </div>

        {/* ROUND OF 16 */}
        <div className="bracket-column r16-column">
          <h4 className="column-title">Octavos de Final</h4>
          <div className="bracket-matches-list">
            {r16Matches.map(m => (
              <BracketMatchNode key={m.id} match={m} onUpdateScore={updateMatchScore} />
            ))}
          </div>
        </div>

        {/* QUARTER FINALS */}
        <div className="bracket-column qf-column">
          <h4 className="column-title">Cuartos de Final</h4>
          <div className="bracket-matches-list">
            {qfMatches.map(m => (
              <BracketMatchNode key={m.id} match={m} onUpdateScore={updateMatchScore} />
            ))}
          </div>
        </div>

        {/* SEMI FINALS */}
        <div className="bracket-column sf-column">
          <h4 className="column-title">Semifinales</h4>
          <div className="bracket-matches-list">
            {sfMatches.map(m => (
              <BracketMatchNode key={m.id} match={m} onUpdateScore={updateMatchScore} />
            ))}
          </div>
        </div>

        {/* FINALS */}
        <div className="bracket-column final-column">
          <h4 className="column-title">Finales</h4>
          <div className="finals-wrapper">
            {finalMatch && (
              <div className="final-node-group">
                <span className="node-group-label champion-label">🏆 Gran Final</span>
                <BracketMatchNode match={finalMatch} onUpdateScore={updateMatchScore} isFinalNode />
              </div>
            )}
            
            {thirdPlaceMatch && (
              <div className="final-node-group third-place-group">
                <span className="node-group-label">🥉 Tercer Puesto</span>
                <BracketMatchNode match={thirdPlaceMatch} onUpdateScore={updateMatchScore} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BracketMatchNodeProps {
  match: Match;
  onUpdateScore: any;
  isFinalNode?: boolean;
}

const BracketMatchNode: React.FC<BracketMatchNodeProps> = ({ match, onUpdateScore, isFinalNode = false }) => {
  const isCompleted = match.isCompleted;

  const handleScoreChange = (side: 'home' | 'away', val: string) => {
    const score = val === '' ? null : Math.max(0, parseInt(val, 10));
    if (side === 'home') {
      onUpdateScore(
        match.id,
        score,
        match.awayScore,
        match.homePenaltyScore,
        match.awayPenaltyScore,
        match.winnerId
      );
    } else {
      onUpdateScore(
        match.id,
        match.homeScore,
        score,
        match.homePenaltyScore,
        match.awayPenaltyScore,
        match.winnerId
      );
    }
  };

  const handlePenaltyChange = (side: 'home' | 'away', val: string) => {
    const penalty = val === '' ? null : Math.max(0, parseInt(val, 10));
    if (side === 'home') {
      onUpdateScore(
        match.id,
        match.homeScore,
        match.awayScore,
        penalty,
        match.awayPenaltyScore,
        match.winnerId
      );
    } else {
      onUpdateScore(
        match.id,
        match.homeScore,
        match.awayScore,
        match.homePenaltyScore,
        penalty,
        match.winnerId
      );
    }
  };

  const selectWinner = (teamId: string) => {
    onUpdateScore(
      match.id,
      match.homeScore,
      match.awayScore,
      match.homePenaltyScore,
      match.awayPenaltyScore,
      teamId
    );
  };

  const isTied =
    isCompleted &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore === match.awayScore;

  // Shorten name helper
  const getShortName = (team: Team | null, placeholder: string | null) => {
    if (team) return team.name.slice(0, 12);
    return placeholder || 'Por definir';
  };

  const isHomeWinner = match.winnerId !== null && match.homeTeam?.id === match.winnerId;
  const isAwayWinner = match.winnerId !== null && match.awayTeam?.id === match.winnerId;

  return (
    <div className={`bracket-node ${isCompleted ? 'node-completed' : ''} ${isFinalNode ? 'node-final-styled' : ''}`}>
      <div className="node-header">
        <span className="node-id">{match.id}</span>
        <span className="node-meta">{formatDate(match.date)}</span>
      </div>

      <div className="node-body">
        {/* Home Row */}
        <div className={`node-team-row ${isHomeWinner ? 'team-winner' : ''} ${!match.homeTeam ? 'team-placeholder' : ''}`}>
          <div className="node-team-info">
            {match.homeTeam ? (
              <img className="node-team-flag-img" src={getFlagUrl(match.homeTeam.id)} alt={match.homeTeam.name} />
            ) : (
              <span className="node-team-flag-placeholder">❓</span>
            )}
            <span className="node-team-name">{getShortName(match.homeTeam, match.homeTeamPlaceholder)}</span>
          </div>
          <input
            type="number"
            min="0"
            className="node-score-input"
            value={match.homeScore !== null ? match.homeScore : ''}
            disabled={!match.homeTeam || !match.awayTeam}
            placeholder="-"
            onChange={e => handleScoreChange('home', e.target.value)}
          />
        </div>

        {/* Away Row */}
        <div className={`node-team-row ${isAwayWinner ? 'team-winner' : ''} ${!match.awayTeam ? 'team-placeholder' : ''}`}>
          <div className="node-team-info">
            {match.awayTeam ? (
              <img className="node-team-flag-img" src={getFlagUrl(match.awayTeam.id)} alt={match.awayTeam.name} />
            ) : (
              <span className="node-team-flag-placeholder">❓</span>
            )}
            <span className="node-team-name">{getShortName(match.awayTeam, match.awayTeamPlaceholder)}</span>
          </div>
          <input
            type="number"
            min="0"
            className="node-score-input"
            value={match.awayScore !== null ? match.awayScore : ''}
            disabled={!match.homeTeam || !match.awayTeam}
            placeholder="-"
            onChange={e => handleScoreChange('away', e.target.value)}
          />
        </div>
      </div>

      {/* Penalties popup inline */}
      {isTied && match.homeTeam && match.awayTeam && (
        <div className="node-penalty-row">
          <span className="node-penalty-label">Penaltis:</span>
          <div className="node-penalty-inputs">
            <input
              type="number"
              min="0"
              className="node-penalty-input"
              value={match.homePenaltyScore !== null ? match.homePenaltyScore : ''}
              placeholder="Pk"
              onChange={e => handlePenaltyChange('home', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              className="node-penalty-input"
              value={match.awayPenaltyScore !== null ? match.awayPenaltyScore : ''}
              placeholder="Pk"
              onChange={e => handlePenaltyChange('away', e.target.value)}
            />
          </div>
          {match.homePenaltyScore === match.awayPenaltyScore && (
            <div className="node-winner-selector">
              <button
                type="button"
                title={match.homeTeam.name}
                className={`node-pick-btn ${match.winnerId === match.homeTeam.id ? 'active' : ''}`}
                onClick={() => selectWinner(match.homeTeam!.id)}
              >
                <img className="node-team-flag-img" src={getFlagUrl(match.homeTeam.id)} alt={match.homeTeam.name} />
              </button>
              <button
                type="button"
                title={match.awayTeam.name}
                className={`node-pick-btn ${match.winnerId === match.awayTeam.id ? 'active' : ''}`}
                onClick={() => selectWinner(match.awayTeam!.id)}
              >
                <img className="node-team-flag-img" src={getFlagUrl(match.awayTeam.id)} alt={match.awayTeam.name} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="node-footer">
        <span className="node-stadium" title={match.stadium}>
          {match.stadium.split(',')[0]}
        </span>
      </div>
    </div>
  );
};
