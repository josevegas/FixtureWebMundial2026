import React from 'react';
import { useFixture } from '../../../context/FixtureContext';
import { GroupTable } from './GroupTable';
import { Card } from '../../../components/Card';
import { getFlagUrl } from '../../../utils/helpers';

export const GroupGrid: React.FC = () => {
  const { groups } = useFixture();

  // Find all third-placed teams across the 12 groups
  const getAllThirdPlacedTeams = () => {
    const thirds = groups.map(g => {
      if (g.teams.length >= 3) {
        return g.teams[2];
      }
      return null;
    }).filter(Boolean);

    // Sort by points, gd, gf, name
    return (thirds as any[]).sort((a, b) => {
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

  const thirdPlacedStandings = getAllThirdPlacedTeams();

  return (
    <div className="groups-container">
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
    </div>
  );
};
