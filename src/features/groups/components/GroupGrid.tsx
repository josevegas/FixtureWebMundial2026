import React, {useMemo} from 'react';
import { useFixture } from '../../../context/useFixture';
import { GroupTable } from './GroupTable';
import { Card } from '../../../components/Card';
import { getFlagUrl, compareTeamsStandings } from '../../../utils/helpers';
import type { Team } from '../../../types';

// Definimos la extensión de tipos correcta para los terceros lugares
interface ThirdPlacedTeam extends Team {
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: number;
  goalsFor: number;
}

export const GroupGrid: React.FC = () => {
  const { groups, isLoading, error } = useFixture();

  // Envolvemos el cálculo pesado en un useMemo con tipado estricto
  const thirdPlacedStandings = useMemo<ThirdPlacedTeam[]>(()=> {
    const thirds: ThirdPlacedTeam[] = [];
    groups.forEach(g=>{
      if(g.teams && g.teams.length>=3){
        thirds.push({
          ...g.teams[2],
          group: g.id // Guardamos a qué grupo pertenece originalmente
        } as ThirdPlacedTeam);
      }
    });
    // Use reusable comparator function for FIFA standings
    return thirds.sort(compareTeamsStandings);
  },[groups]);

  return (
    <div className="groups-container">
      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚙️</div>
          <p>Cargando datos de los grupos...</p>
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
      {/* Grid of Groups */}
      <div className="groups-grid">
        {groups.map(group => (
          <GroupTable key={group.id} group={group} />
        ))}
      </div>

      {/* 3rd Placed Leaderboard */}
      <Card className="thirds-leaderboard-card" title="Tabla de Terceros Lugares" subtitle="Los mejores 8 terceros clasifican a la Ronda de 32">
        <div className="table-responsive">
          <table className="thirds-table">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Grupo</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>G</th>
                <th>E</th>
                <th>P</th>
                <th>DG</th>
                <th className="th-pts">Pts</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {thirdPlacedStandings.map((team, idx) => {
                const isQualified = idx < 8;
                return (
                   <tr key={team.id} className={isQualified ? 'third-row-qualified' : 'third-row-eliminated'}>
                    <td>{idx + 1}</td>
                    <td>Grupo {team.group}</td>
                    <td>
                      <img className="team-flag-img" src={getFlagUrl(team.id)} alt={team.name} />
                      <span className="team-name">{team.name}</span>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td className={`td-gd ${team.goalDifference > 0 ? 'gd-positive' : team.goalDifference < 0 ? 'gd-negative' : ''}`}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </td>
                    <td className="td-pts">{team.points}</td>
                    <td>
                      <span className={`status-pill ${isQualified ? 'status-green' : 'status-red'}`}>
                        {isQualified ? 'Clasificado' : 'Eliminado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
        </>
      )}
    </div>
  );
};
