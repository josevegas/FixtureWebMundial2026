import { createContext, useState, useMemo, useCallback, type ReactNode, useEffect, useRef } from 'react';
import type { Team, Match, Stadium, Group } from '../types/index';
import { recalculateGroupStage } from '../utils/recalculateGroupStage';
import { normalizeMatch, compareTeamsStandings, type ApiMatch } from '../utils/helpers';

interface FixtureContextType {
  teams: Team[];
  stadiums: Stadium[];
  matches: Match[];
  updateMatchScore: (
    matchId: string, 
    homeScore: number | null, 
    awayScore: number | null,
    homePenaltyScore: number | null,
    awayPenaltyScore: number | null,
    winnerId: string | null
  ) => void;
  groups: Group[];
  isLoading: boolean;
  error: string | null;
}

export type { FixtureContextType };

const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

export { FixtureContext };

export const FixtureProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para asegurar que la API solo se llama una sola vez, incluso en StrictMode
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    // Evita que la API se llame múltiples veces incluso en StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    const fetchFixtureData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [teamsRes, matchesRes, stadiumsRes] = await Promise.all([
          fetch('https://apimundialfutbol2026.onrender.com/teams/'),
          fetch('https://apimundialfutbol2026.onrender.com/matches/'),
          fetch('https://apimundialfutbol2026.onrender.com/stadiums/')
        ]);
        if (!teamsRes.ok || !matchesRes.ok || !stadiumsRes.ok) {
          throw new Error('Error al cargar datos');
        }
        const teamsData: Team[] = await teamsRes.json();
        const matchesData: ApiMatch[] = await matchesRes.json();
        const stadiumsData: Stadium[] = await stadiumsRes.json();
        
        const teamsMap = new Map(teamsData.map(t => [t.id, t]));
        const normalizedMatches = matchesData.map((m: ApiMatch) => normalizeMatch(m, teamsMap));
        
        setTeams(teamsData);
        setMatches(normalizedMatches);
        setStadiums(stadiumsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFixtureData();
  },[]);

  const updateMatchScore = useCallback((
    matchId: string, 
    homeScore: number | null, 
    awayScore: number | null,
    homePenaltyScore: number | null, 
    awayPenaltyScore: number | null, 
    winnerId: string | null
  ) => {
    // 1. Actualizar el partido
    const updatedMatches = matches.map(m => {
      if (m.id !== matchId) return m;
      const isCompleted = homeScore !== null && awayScore !== null;
      // Solo mantener winnerId si no es fase de grupos
      const finalWinnerId = isCompleted && m.stage !== 'group' ? winnerId : null;
      
      return {
        ...m,
        homeScore,
        awayScore,
        homePenaltyScore,
        awayPenaltyScore,
        isCompleted,
        winnerId: finalWinnerId,
      };
    });
    
    // 2. Guardar los cambios
    setMatches(updatedMatches);
    
    // 3. Recalcular la tabla de grupos (solo si el partido que cambió fue de fase de grupos)
    const currentMatch = updatedMatches.find(m => m.id === matchId);
    if (currentMatch?.stage === 'group') {
      const newTeams = recalculateGroupStage(teams, updatedMatches);
      setTeams(newTeams);
    }
  }, [matches, teams]);

  const groups: Group[] = useMemo(() => {
    if (teams.length === 0) return [];
    //1. Agrupar equipos por su propiedad 'group'
    const groupedData = teams.reduce((acc, team) => {
      if (!acc[team.group]) {
        acc[team.group] = { id: team.group, teams: [] };
      }
      acc[team.group].teams.push(team);
      return acc;
    }, {} as Record<string, Group>);
    //2. Convertir objeto a array y ordenar equipos dentro de cada grupo
    return Object.values(groupedData).map(g => {
      const sortedTeams = [...g.teams].sort(compareTeamsStandings);
      return { ...g, teams: sortedTeams };
    }).sort((a, b) => a.id.localeCompare(b.id));  // Ordenamos grupos por su id (A, B, C...) para consistencia
  }, [teams]); // Solo se recalcula cuando cambian los equipos (estadísticas)

  return (
    <FixtureContext.Provider value={{ teams, stadiums, matches, groups, isLoading, error, updateMatchScore }}>
      {children}
    </FixtureContext.Provider>
  );
};