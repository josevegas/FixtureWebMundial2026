import { useState, useMemo } from 'react';
import { useFixture } from '../../../context/FixtureContext';
import type { StageType } from '../../../types';

export const useMatches = () => {
  const { matches } = useFixture();
  const [selectedStage, setSelectedStage] = useState<StageType | 'all'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // Stage filter
      if (selectedStage !== 'all' && match.stage !== selectedStage) {
        return false;
      }
      
      // Group filter (only applies for group stage matches)
      if (selectedGroup !== 'all') {
        if (match.stage !== 'group' || match.group !== selectedGroup) {
          return false;
        }
      }

      // Search filter (team name)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const homeName = match.homeTeam?.name.toLowerCase() || match.homeTeamPlaceholder?.toLowerCase() || '';
        const awayName = match.awayTeam?.name.toLowerCase() || match.awayTeamPlaceholder?.toLowerCase() || '';
        if (!homeName.includes(query) && !awayName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [matches, selectedStage, selectedGroup, searchQuery]);

  const stats = useMemo(() => {
    let completed = 0;
    let goals = 0;
    
    matches.forEach(m => {
      if (m.isCompleted) {
        completed++;
        goals += (m.homeScore || 0) + (m.awayScore || 0);
      }
    });

    return {
      total: matches.length,
      completed,
      goals,
      pending: matches.length - completed,
    };
  }, [matches]);

  return {
    filteredMatches,
    selectedStage,
    setSelectedStage,
    selectedGroup,
    setSelectedGroup,
    searchQuery,
    setSearchQuery,
    stats,
  };
};
