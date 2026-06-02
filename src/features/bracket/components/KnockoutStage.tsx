import React, { useMemo } from 'react';
import { useFixture } from '../../../context/useFixture';
import { getStageLabelEs } from '../../../utils/helpers';
import { MatchCard } from '../../matches/components/MatchCard';
import type { Match } from '../../../types';

export const KnockoutStage: React.FC = () => {
  const { matches, isLoading, error } = useFixture();

  // 1. Agrupar eficientemente los partidos de eliminación directa usando useMemo
  const rounds = useMemo(() => {
    const knockoutStages = ['round_32', 'round_16', 'quarter', 'semi', 'final'] as const;
    
    return knockoutStages.map(stage => ({
      stage,
      title: getStageLabelEs(stage),
      matches: matches.filter(m => m.stage === stage)
    }));
  }, [matches]);

  return (
    <div className="p-6 max-w-[100vw] overflow-x-auto select-none">
      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚙️</div>
          <p>Cargando datos de las eliminatorias...</p>
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
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Fase de Eliminación Directa
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Simula los resultados para avanzar a los equipos hasta la final.
        </p>
      </header>

      {/* Contenedor del Árbol / Bracket con scroll horizontal en móviles si es necesario */}
      <div className="flex gap-8 min-w-[1200px] pb-6 items-start justify-start">
        {rounds.map((round) => (
          <div 
            key={round.stage} 
            className="flex-1 flex flex-col gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100"
          >
            {/* Cabecera de la columna (Ronda) */}
            <div className="text-center sticky top-0 bg-white py-2 px-3 border rounded-lg shadow-sm mb-2">
              <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
                {round.title}
              </h3>
              <span className="text-[10px] text-gray-400 font-semibold block">
                {round.matches.length} {round.matches.length === 1 ? 'Partido' : 'Partidos'}
              </span>
            </div>

            {/* Render de los partidos de esta ronda específica */}
            <div className={`flex flex-col justify-around gap-6 h-full min-h-[500px]`}>
              {round.matches.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 italic bg-white border border-dashed rounded-xl">
                  Esperando clasificados...
                </div>
              ) : (
                round.matches.map((match: Match) => (
                  <div 
                    key={match.id} 
                    className="w-full transition-transform duration-200 hover:scale-[1.01]"
                  >
                    {/* Reutilizamos el MatchCard que ya maneja inputs y estado global */}
                    <MatchCard match={match} />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};