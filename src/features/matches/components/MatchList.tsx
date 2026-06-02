import React,{useMemo} from 'react';
import { useMatches } from '../hooks/useMatches';
import { MatchCard } from './MatchCard';
import type { StageType } from '../../../types';

const STAGES: { value: StageType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'group', label: 'Fase de Grupos' },
  { value: 'round_32', label: 'Ronda de 32' },
  { value: 'round_16', label: 'Octavos' },
  { value: 'quarter', label: 'Cuartos' },
  { value: 'semi', label: 'Semifinales' },
  { value: 'third_place', label: '3er Lugar' },
  { value: 'final', label: 'Final' },
];

export const MatchList: React.FC = () => {
  const {
    filteredMatches: rawFilteredMatches,
    selectedStage,
    setSelectedStage,
    selectedGroup,
    setSelectedGroup,
    searchQuery,
    setSearchQuery,
    stats,
    isLoading,
    error,
  } = useMatches();


  const groups = useMemo(()=>['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],[]);

  // Memorizar la renderización de la grilla para evitar recálculos visuales agresivos
  const renderedMatches = useMemo(() => {
    return rawFilteredMatches.map(match => (
      <MatchCard key={match.id} match={match} />
    ));
  }, [rawFilteredMatches]);

  return (
    <div className="matches-section-container">
      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚙️</div>
          <p>Cargando datos de la API...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '4px solid rgb(239, 68, 68)',
          borderRadius: '4px',
          marginBottom: '24px',
          color: 'rgb(239, 68, 68)',
        }}>
          <strong>❌ Error al cargar:</strong> {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
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
          {STAGES.map(stage => (
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
      {rawFilteredMatches.length > 0 ? (
        <div className="matches-grid">
          {renderedMatches}
        </div>
      ) : (
        <div className="empty-matches-state">
          <span className="empty-icon">⚽</span>
          <h3>No se encontraron partidos</h3>
          <p>Intenta cambiar los filtros o el texto de búsqueda.</p>
        </div>
      )}
        </>
      )}
    </div>
  );
};
