import React from 'react';
import { useMatches } from '../hooks/useMatches';
import { MatchCard } from './MatchCard';
import type { StageType } from '../../../types';

export const MatchList: React.FC = () => {
  const {
    filteredMatches,
    selectedStage,
    setSelectedStage,
    selectedGroup,
    setSelectedGroup,
    searchQuery,
    setSearchQuery,
    stats,
  } = useMatches();

  const stages: { value: StageType | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'group', label: 'Fase de Grupos' },
    { value: 'round_32', label: 'Ronda de 32' },
    { value: 'round_16', label: 'Octavos' },
    { value: 'quarter', label: 'Cuartos' },
    { value: 'semi', label: 'Semifinales' },
    { value: 'third_place', label: '3er Lugar' },
    { value: 'final', label: 'Final' },
  ];

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="matches-section-container">
      {/* Stats Counter Panel */}
      <div className="stats-dashboard">
        <div className="stat-box">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-lbl">Partidos Totales</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{stats.completed}</span>
          <span className="stat-lbl">Jugados</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{stats.pending}</span>
          <span className="stat-lbl">Pendientes</span>
        </div>
        <div className="stat-box highlight-gold">
          <span className="stat-num">{stats.goals}</span>
          <span className="stat-lbl">Goles Totales</span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="filters-container">
        {/* Search */}
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input-field"
            placeholder="Buscar por equipo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* Stage Filter Pills */}
        <div className="stage-pills">
          {stages.map(stage => (
            <button
              key={stage.value}
              className={`stage-pill-btn ${selectedStage === stage.value ? 'active-pill' : ''}`}
              onClick={() => {
                setSelectedStage(stage.value);
                // Reset group filter if switching to a non-group stage
                if (stage.value !== 'all' && stage.value !== 'group') {
                  setSelectedGroup('all');
                }
              }}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Group Filter Selector (visible if stage is all or group) */}
        {(selectedStage === 'all' || selectedStage === 'group') && (
          <div className="group-filter-wrapper">
            <span className="filter-label">Filtrar por Grupo:</span>
            <select
              className="group-select-dropdown"
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              <option value="all">Todos los grupos</option>
              {groups.map(g => (
                <option key={g} value={g}>
                  Grupo {g}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Match Grid */}
      {filteredMatches.length > 0 ? (
        <div className="matches-grid">
          {filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="empty-matches-state">
          <span className="empty-icon">⚽</span>
          <h3>No se encontraron partidos</h3>
          <p>Intenta cambiar los filtros o el texto de búsqueda.</p>
        </div>
      )}
    </div>
  );
};
