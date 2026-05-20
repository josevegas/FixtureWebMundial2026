import React from 'react';
import type { Group } from '../../../types';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { getFlagUrl } from '../../../utils/helpers';

interface GroupTableProps {
  group: Group;
}

export const GroupTable: React.FC<GroupTableProps> = ({ group }) => {
  return (
    <Card className="group-card">
      <div className="group-card-header">
        <h3 className="group-name">Grupo {group.id}</h3>
        <Badge variant="info">Grupo {group.id}</Badge>
      </div>
      
      <div className="table-responsive">
        <table className="group-table">
          <thead>
            <tr>
              <th className="th-pos">Pos</th>
              <th className="th-team">Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th className="hide-mobile">GF</th>
              <th className="hide-mobile">GC</th>
              <th>DG</th>
              <th className="th-pts">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, idx) => {
              // Color coding position
              let posClass = 'pos-eliminated';
              if (idx < 2) {
                posClass = 'pos-qualified';
              } else if (idx === 2) {
                posClass = 'pos-third-contender';
              }

              return (
                <tr key={team.id} className={`team-row ${posClass}`}>
                  <td className="td-pos">
                    <span className={`pos-indicator ${posClass}`}>{idx + 1}</span>
                  </td>
                  <td className="td-team">
                    <img className="team-flag-img" src={getFlagUrl(team.id)} alt={team.name} />
                    <span className="team-name" title={team.name}>
                      {team.name}
                    </span>
                  </td>
                  <td>{team.played}</td>
                  <td>{team.won}</td>
                  <td>{team.drawn}</td>
                  <td>{team.lost}</td>
                  <td className="hide-mobile">{team.goalsFor}</td>
                  <td className="hide-mobile">{team.goalsAgainst}</td>
                  <td className={`td-gd ${team.goalDifference > 0 ? 'gd-positive' : team.goalDifference < 0 ? 'gd-negative' : ''}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </td>
                  <td className="td-pts">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
