import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Team, Match, Stadium, Group, StageType } from '../types/index';

interface FixtureContextType {
  teams: Team[];
  stadiums: Stadium[];
  matches: Match[];
  updateMatchScore: (
    matchId: string, 
    homeScore: number|null, 
    awayScore: number|null,
    homePenaltyScore?: number|null,
    awayPenaltyScore?: number|null,
    winnerId?: string | null
  ) => void;
  groups: Group[]; // Agregamos la propiedad de grupos al contexto
}

const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

// Aquí inyectas los JSONs que me pasaste en el prompt
const initialTeams: Team[] = [
  { id: 'MEX', name: 'México', flag: 'MEX', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'RSA', name: 'Sudáfrica', flag: 'RSA', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'KOR', name: 'República de Corea', flag: 'KOR', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CZE', name: 'Chequia', flag: 'CZE', group: 'A', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'CAN', name: 'Canadá', flag: 'CAN', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'BIH', name: 'Bosnia y Herzegovina', flag: 'BIH', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'QAT', name: 'Catar', flag: 'QAT', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SUI', name: 'Suiza', flag: 'SUI', group: 'B', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'BRA', name: 'Brasil', flag: 'BRA', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'MAR', name: 'Marruecos', flag: 'MAR', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'HAI', name: 'Haití', flag: 'HAI', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SCO', name: 'Escocia', flag: 'SCO', group: 'C', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'USA', name: 'EE. UU.', flag: 'USA', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'PAR', name: 'Paraguay', flag: 'PAR', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'AUS', name: 'Australia', flag: 'AUS', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'TUR', name: 'Turquía', flag: 'TUR', group: 'D', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'GER', name: 'Alemania', flag: 'GER', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CUW', name: 'Curazao', flag: 'CUW', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CIV', name: 'Costa de Marfil', flag: 'CIV', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'ECU', name: 'Ecuador', flag: 'ECU', group: 'E', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'NED', name: 'Países Bajos', flag: 'NED', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'JPN', name: 'Japón', flag: 'JPN', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SWE', name: 'Suecia', flag: 'SWE', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'TUN', name: 'Túnez', flag: 'TUN', group: 'F', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'BEL', name: 'Bélgica', flag: 'BEL', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'EGY', name: 'Egipto', flag: 'EGY', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'IRN', name: 'Irán', flag: 'IRN', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'NZL', name: 'Nueva Zelanda', flag: 'NZL', group: 'G', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'ESP', name: 'España', flag: 'ESP', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CPV', name: 'Cabo Verde', flag: 'CPV', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'KSA', name: 'Arabia Saudí', flag: 'KSA', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'URU', name: 'Uruguay', flag: 'URU', group: 'H', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'FRA', name: 'Francia', flag: 'FRA', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'SEN', name: 'Senegal', flag: 'SEN', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'IRQ', name: 'Irak', flag: 'IRQ', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'NOR', name: 'Noruega', flag: 'NOR', group: 'I', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'ARG', name: 'Argentina', flag: 'ARG', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'ALG', name: 'Argelia', flag: 'ALG', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'AUT', name: 'Austria', flag: 'AUT', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'JOR', name: 'Jordania', flag: 'JOR', group: 'J', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'POR', name: 'Portugal', flag: 'POR', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'COD', name: 'RD CONGO', flag: 'COD', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'UZB', name: 'Uzbekistán', flag: 'UZB', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'COL', name: 'Colombia', flag: 'COL', group: 'K', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },

  { id: 'ENG', name: 'Inglaterra', flag: 'ENG', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'CRO', name: 'Croacia', flag: 'CRO', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'GHA', name: 'Ghana', flag: 'GHA', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  { id: 'PAN', name: 'Panamá', flag: 'PAN', group: 'L', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
];
const initialStadiums: Stadium[] = [
  { id: 'EAZ', name: 'Estadio Azteca,  Ciudad de México', country: 'México'},
  { id: 'EAK', name: 'Estadio Akron, Guadalajara', country: 'México'},
  { id: 'EBB', name: 'Estadio BBVA, Monterrey', country: 'México'},
  { id: 'MBS', name: 'Mercedes-Benz Stadium, Atlanta', country: 'EE. UU.'},
  { id: 'LES', name: 'Levi\'s Stadium, San Francisco', country: 'EE. UU.'},
  { id: 'SFS', name: 'SoFi Stadium, Los Angeles', country: 'EE. UU.'},
  { id: 'LUS', name: 'Lumen Stadium, Seattle', country: 'EE. UU.'},
  { id: 'MLS', name: 'MetLife Stadium, NY/NJ', country: 'EE. UU.'},
  { id: 'GIS', name: 'Gillette Stadium, Boston', country: 'EE. UU.'},
  { id: 'LFF', name: 'Lincoln Financial Field, Philadelphia', country: 'EE. UU.'},
  { id: 'HRS', name: 'Hard Rock Stadium, Miami Garden', country: 'EE. UU.'},
  { id: 'NRS', name: 'NRG Stadium, Houston', country: 'EE. UU.'},
  { id: 'AHS', name: 'Arrowhead Stadium, Kansas City', country: 'EE. UU.'},
  { id: 'ATS', name: 'AT&T Stadium, Dallas', country: 'EE. UU.'},
  { id: 'BMO', name: 'BMO Field, Toronto', country: 'Canadá'},
  { id: 'BCP', name: 'BC Place, Vancouver', country: 'Canadá'},
];
const initialMatches = [
  // Ejemplo de un partido de fase de grupos
  { id: 'M1', homeTeamId: 'MEX', awayTeamId: 'RSA', date: '2026-06-11T16:00:00Z', stadiumId: 'EAZ', stage: 'group', group: 'A' },
  { id: 'M2', group: 'A', homeTeamId: 'KOR', awayTeamId: 'CZE', date: '2026-06-11T20:00:00Z', stadiumId: 'EAK', stage: 'group' },
  { id: 'M3', group: 'B', homeTeamId: 'CAN', awayTeamId: 'BIH', date: '2026-06-12T17:00:00Z', stadiumId: 'BMO', stage: 'group' },
  { id: 'M4', group: 'D', homeTeamId: 'USA', awayTeamId: 'PAR', date: '2026-06-12T21:00:00Z', stadiumId: 'SFS', stage: 'group' },
  { id: 'M5', group: 'B', homeTeamId: 'QAT', awayTeamId: 'SUI', date: '2026-06-13T15:00:00Z', stadiumId: 'LES', stage: 'group' },
  { id: 'M6', group: 'C', homeTeamId: 'BRA', awayTeamId: 'MAR', date: '2026-06-13T18:00:00Z', stadiumId: 'MLS', stage: 'group' },
  { id: 'M7', group: 'C', homeTeamId: 'HAI', awayTeamId: 'SCO', date: '2026-06-13T21:00:00Z', stadiumId: 'GIS', stage: 'group' },
  { id: 'M8', group: 'D', homeTeamId: 'AUS', awayTeamId: 'TUR', date: '2026-06-13T23:00:00Z', stadiumId: 'BCP', stage: 'group' },
  { id: 'M9', group: 'E', homeTeamId: 'GER', awayTeamId: 'CUW', date: '2026-06-14T13:00:00Z', stadiumId: 'NRS', stage: 'group' },
  { id: 'M10', group: 'F', homeTeamId: 'NED', awayTeamId: 'JPN', date: '2026-06-14T16:00:00Z', stadiumId: 'ATS', stage: 'group' },
  { id: 'M11', group: 'E', homeTeamId: 'CIV', awayTeamId: 'ECU', date: '2026-06-14T19:00:00Z', stadiumId: 'LFF', stage: 'group' },
  { id: 'M12', group: 'F', homeTeamId: 'SWE', awayTeamId: 'TUN', date: '2026-06-14T22:00:00Z', stadiumId: 'EBB', stage: 'group' },
  { id: 'M13', group: 'H', homeTeamId: 'ESP', awayTeamId: 'CPV', date: '2026-06-15T12:00:00Z', stadiumId: 'MBS', stage: 'group' },
  { id: 'M14', group: 'G', homeTeamId: 'BEL', awayTeamId: 'EGY', date: '2026-06-15T15:00:00Z', stadiumId: 'LUS', stage: 'group' },
  { id: 'M15', group: 'H', homeTeamId: 'KSA', awayTeamId: 'URU', date: '2026-06-15T18:00:00Z', stadiumId: 'HRS', stage: 'group' },
  { id: 'M16', group: 'G', homeTeamId: 'IRN', awayTeamId: 'NZL', date: '2026-06-15T21:00:00Z', stadiumId: 'SFS', stage: 'group' },
  { id: 'M17', group: 'I', homeTeamId: 'FRA', awayTeamId: 'SEN', date: '2026-06-16T15:00:00Z', stadiumId: 'MLS', stage: 'group' },
  { id: 'M18', group: 'I', homeTeamId: 'IRQ', awayTeamId: 'NOR', date: '2026-06-16T18:00:00Z', stadiumId: 'GIS', stage: 'group' },
  { id: 'M19', group: 'J', homeTeamId: 'ARG', awayTeamId: 'ALG', date: '2026-06-16T21:00:00Z', stadiumId: 'AHS', stage: 'group' },
  { id: 'M20', group: 'J', homeTeamId: 'AUT', awayTeamId: 'JOR', date: '2026-06-16T00:00:00Z', stadiumId: 'LES', stage: 'group' },
  { id: 'M21', group: 'K', homeTeamId: 'POR', awayTeamId: 'COD', date: '2026-06-17T13:00:00Z', stadiumId: 'NRS', stage: 'group' },
  { id: 'M22', group: 'L', homeTeamId: 'ENG', awayTeamId: 'CRO', date: '2026-06-17T16:00:00Z', stadiumId: 'ATS', stage: 'group' },
  { id: 'M23', group: 'L', homeTeamId: 'GHA', awayTeamId: 'PAN', date: '2026-06-17T19:00:00Z', stadiumId: 'BMO', stage: 'group' },
  { id: 'M24', group: 'K', homeTeamId: 'UZB', awayTeamId: 'COL', date: '2026-06-17T22:00:00Z', stadiumId: 'EAZ', stage: 'group' },
  { id: 'M25', group: 'A', homeTeamId: 'CZE', awayTeamId: 'RSA', date: '2026-06-18T12:00:00Z', stadiumId: 'MBS', stage: 'group' },
  { id: 'M26', group: 'B', homeTeamId: 'SUI', awayTeamId: 'BIH', date: '2026-06-18T15:00:00Z', stadiumId: 'EAK', stage: 'group' },
  { id: 'M27', group: 'B', homeTeamId: 'CAN', awayTeamId: 'QAT', date: '2026-06-18T18:00:00Z', stadiumId: 'BCP', stage: 'group' },
  { id: 'M28', group: 'A', homeTeamId: 'MEX', awayTeamId: 'KOR', date: '2026-06-18T21:00:00Z', stadiumId: 'EAK', stage: 'group' },
  { id: 'M29', group: 'D', homeTeamId: 'USA', awayTeamId: 'AUT', date: '2026-06-19T15:00:00Z', stadiumId: 'LUS', stage: 'group' },
  { id: 'M30', group: 'C', homeTeamId: 'SCO', awayTeamId: 'MAR', date: '2026-06-19T18:00:00Z', stadiumId: 'GIS', stage: 'group' },
  { id: 'M31', group: 'C', homeTeamId: 'BRA', awayTeamId: 'HAI', date: '2026-06-19T21:00:00Z', stadiumId: 'LFF', stage: 'group' },
  { id: 'M32', group: 'D', homeTeamId: 'TUR', awayTeamId: 'PAR', date: '2026-06-19T00:00:00Z', stadiumId: 'LES', stage: 'group' },
  { id: 'M33', group: 'F', homeTeamId: 'NED', awayTeamId: 'SWE', date: '2026-06-20T13:00:00Z', stadiumId: 'NRS', stage: 'group' },
  { id: 'M34', group: 'E', homeTeamId: 'GER', awayTeamId: 'CIV', date: '2026-06-20T16:00:00Z', stadiumId: 'BMO', stage: 'group' },
  { id: 'M35', group: 'E', homeTeamId: 'ECU', awayTeamId: 'CUW', date: '2026-06-20T22:00:00Z', stadiumId: 'AHS', stage: 'group' },
  { id: 'M36', group: 'F', homeTeamId: 'TUN', awayTeamId: 'JPN', date: '2026-06-20T00:00:00Z', stadiumId: 'EBB', stage: 'group' },
  { id: 'M37', group: 'H', homeTeamId: 'ESP', awayTeamId: 'KSA', date: '2026-06-21T12:00:00Z', stadiumId: 'MBS', stage: 'group' },
  { id: 'M38', group: 'G', homeTeamId: 'BEL', awayTeamId: 'IRN', date: '2026-06-21T15:00:00Z', stadiumId: 'SFS', stage: 'group' },
  { id: 'M39', group: 'H', homeTeamId: 'URU', awayTeamId: 'CPV', date: '2026-06-21T18:00:00Z', stadiumId: 'HRS', stage: 'group' },
  { id: 'M40', group: 'G', homeTeamId: 'NZL', awayTeamId: 'EGY', date: '2026-06-21T21:00:00Z', stadiumId: 'BCP', stage: 'group' },
  { id: 'M41', group: 'J', homeTeamId: 'ARG', awayTeamId: 'AUT', date: '2026-06-22T13:00:00Z', stadiumId: 'ATS', stage: 'group' },
  { id: 'M42', group: 'I', homeTeamId: 'FRA', awayTeamId: 'IRQ', date: '2026-06-22T17:00:00Z', stadiumId: 'LFF', stage: 'group' },
  { id: 'M43', group: 'I', homeTeamId: 'NOR', awayTeamId: 'SEN', date: '2026-06-22T20:00:00Z', stadiumId: 'MLS', stage: 'group' },
  { id: 'M44', group: 'J', homeTeamId: 'JOR', awayTeamId: 'ALG', date: '2026-06-22T23:00:00Z', stadiumId: 'LES', stage: 'group' },
  { id: 'M45', group: 'K', homeTeamId: 'POR', awayTeamId: 'UZB', date: '2026-06-23T13:00:00Z', stadiumId: 'NRS', stage: 'group' },
  { id: 'M46', group: 'L', homeTeamId: 'ENG', awayTeamId: 'GHA', date: '2026-06-23T16:00:00Z', stadiumId: 'GIS', stage: 'group' },
  { id: 'M47', group: 'L', homeTeamId: 'PAN', awayTeamId: 'CRO', date: '2026-06-23T19:00:00Z', stadiumId: 'BMO', stage: 'group' },
  { id: 'M48', group: 'K', homeTeamId: 'COL', awayTeamId: 'COD', date: '2026-06-23T22:00:00Z', stadiumId: 'EAK', stage: 'group' },
  { id: 'M49', group: 'B', homeTeamId: 'SUI', awayTeamId: 'CAN', date: '2026-06-24T15:00:00Z', stadiumId: 'BCP', stage: 'group' },
  { id: 'M50', group: 'B', homeTeamId: 'BIH', awayTeamId: 'QAT', date: '2026-06-24T15:00:00Z', stadiumId: 'LUS', stage: 'group' },
  { id: 'M51', group: 'C', homeTeamId: 'SCO', awayTeamId: 'BRA', date: '2026-06-24T18:00:00Z', stadiumId: 'HRS', stage: 'group' },
  { id: 'M52', group: 'C', homeTeamId: 'MAR', awayTeamId: 'HAI', date: '2026-06-24T18:00:00Z', stadiumId: 'MBS', stage: 'group' },
  { id: 'M53', group: 'A', homeTeamId: 'CZE', awayTeamId: 'MEX', date: '2026-06-24T21:00:00Z', stadiumId: 'CDM', stage: 'group' },
  { id: 'M54', group: 'A', homeTeamId: 'RSA', awayTeamId: 'KOR', date: '2026-06-24T21:00:00Z', stadiumId: 'EBB', stage: 'group' },
  { id: 'M55', group: 'E', homeTeamId: 'CUW', awayTeamId: 'CIV', date: '2026-06-25T16:00:00Z', stadiumId: 'LFF', stage: 'group' },
  { id: 'M56', group: 'E', homeTeamId: 'ECU', awayTeamId: 'GER', date: '2026-06-25T16:00:00Z', stadiumId: 'MLS', stage: 'group' },
  { id: 'M57', group: 'F', homeTeamId: 'JPN', awayTeamId: 'SWE', date: '2026-06-25T19:00:00Z', stadiumId: 'ATS', stage: 'group' },
  { id: 'M58', group: 'F', homeTeamId: 'TUN', awayTeamId: 'NED', date: '2026-06-25T19:00:00Z', stadiumId: 'AHS', stage: 'group' },
  { id: 'M59', group: 'D', homeTeamId: 'TUR', awayTeamId: 'USA', date: '2026-06-25T22:00:00Z', stadiumId: 'SFS', stage: 'group' },
  { id: 'M60', group: 'D', homeTeamId: 'PAR', awayTeamId: 'AUS', date: '2026-06-25T22:00:00Z', stadiumId: 'LES', stage: 'group' },
  { id: 'M61', group: 'I', homeTeamId: 'NOR', awayTeamId: 'FRA', date: '2026-06-26T15:00:00Z', stadiumId: 'GIS', stage: 'group' },
  { id: 'M62', group: 'I', homeTeamId: 'SEN', awayTeamId: 'IRQ', date: '2026-06-26T15:00:00Z', stadiumId: 'BMO', stage: 'group' },
  { id: 'M63', group: 'H', homeTeamId: 'CPV', awayTeamId: 'KSA', date: '2026-06-26T20:00:00Z', stadiumId: 'NRS', stage: 'group' },
  { id: 'M64', group: 'H', homeTeamId: 'URU', awayTeamId: 'ESP', date: '2026-06-26T20:00:00Z', stadiumId: 'EAK', stage: 'group' },
  { id: 'M65', group: 'G', homeTeamId: 'EGY', awayTeamId: 'IRN', date: '2026-06-26T23:00:00Z', stadiumId: 'LUS', stage: 'group' },
  { id: 'M66', group: 'G', homeTeamId: 'NZL', awayTeamId: 'BEL', date: '2026-06-26T23:00:00Z', stadiumId: 'BCP', stage: 'group' },
  { id: 'M67', group: 'L', homeTeamId: 'PAN', awayTeamId: 'ENG', date: '2026-06-27T17:00:00Z', stadiumId: 'MLS', stage: 'group' },
  { id: 'M68', group: 'L', homeTeamId: 'CRO', awayTeamId: 'GHA', date: '2026-06-27T17:00:00Z', stadiumId: 'LFF', stage: 'group' },
  { id: 'M69', group: 'K', homeTeamId: 'COL', awayTeamId: 'POR', date: '2026-06-27T19:30:00Z', stadiumId: 'HRS', stage: 'group' },
  { id: 'M70', group: 'K', homeTeamId: 'COD', awayTeamId: 'UZB', date: '2026-06-27T19:30:00Z', stadiumId: 'MBS', stage: 'group' },
  { id: 'M71', group: 'J', homeTeamId: 'ALG', awayTeamId: 'AUT', date: '2026-06-27T22:00:00Z', stadiumId: 'AHS', stage: 'group' },
  { id: 'M72', group: 'J', homeTeamId: 'JOR', awayTeamId: 'ARG', date: '2026-06-27T22:00:00Z', stadiumId: 'ATS', stage: 'group' },
  // ... resto de partidos
];

const createInitialMatches = (initialTeams: Team[], initialStadiums: Stadium[]): Match[] => {
  const findTeam = (id: string) => initialTeams.find(t => t.id === id) || null;
  const findStadium = (id: string) => initialStadiums.find(s => s.id === id) || null;
  const groupMatches = initialMatches.map(m => {
    const stadium = findStadium(m.stadiumId);
    return {
      id: m.id,
      stage: m.stage as StageType,
      group: m.group || null,
      homeTeam: findTeam(m.homeTeamId),
      awayTeam: findTeam(m.awayTeamId),
      homeTeamPlaceholder: null,
      awayTeamPlaceholder: null,
      homeScore: null,
      awayScore: null,
      homePenaltyScore: null,
      awayPenaltyScore: null,
      stadium: stadium?.name || '',
      date: m.date,
      isCompleted: false,
      winnerId: null,
    };
  });
  return groupMatches;
};
export const FixtureProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [stadiums] = useState<Stadium[]>(initialStadiums);
  const [matches, setMatches] = useState<Match[]>(createInitialMatches(initialTeams, initialStadiums));

  const updateMatchScore = (
    matchId: string, 
    homeScore: number|null, 
    awayScore: number|null,
    homePenaltyScore: number|null, 
    awayPenaltyScore: number|null, 
    winnerId: string | null
  ) => {
    // 1. Actualizar el partido
    const updatedMatches = matches.map(m => {
      if (m.id !== matchId) return m;
      const isCompleted = homeScore !== null && awayScore !== null;
      let finalWinnerId=winnerId;
      if(isCompleted && homeScore !==null&& awayScore!==null){
        if(m.stage==='group'){
          finalWinnerId=null;
        }
      }else{
        finalWinnerId=null;
      }
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
      const newTeams = recalculateGroupStage(initialTeams, updatedMatches);
      setTeams(newTeams);
    }
  };

  const groups: Group[]=useMemo(()=>{
    //1. Agrupar equipos por su propiedad 'group'
    const groupedData=teams.reduce((acc,team)=>{
      if(!acc[team.group]){
        acc[team.group]={id:team.group, teams:[]};
      }
      acc[team.group].teams.push(team);
      return acc;
    },{}as Record<string, Group>);
    //2. Convertir objeto a array y ordenar equipos dentro de cada grupo por puntos, diferencia de goles, goles a favor, etc.
    return Object.values(groupedData).map(g=>{
      const sortedTeams=[...g.teams].sort((a,b)=>{
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.name.localeCompare(b.name);
      });
      return {...g, teams: sortedTeams};
    }).sort((a,b)=>a.id.localeCompare(b.id));  // Ordenamos grupos por su id (A, B, C...) para consistencia
  },[teams]); // Solo se recalcula cuando cambian los equipos (estadísticas)

  return (
    <FixtureContext.Provider value={{ teams, stadiums, matches, updateMatchScore, groups }}>
      {children}
    </FixtureContext.Provider>
  );
};

export const useFixture = (): FixtureContextType => {
  const context = useContext(FixtureContext);
  if (!context) {
    throw new Error('useFixture debe usarse dentro de un FixtureProvider');
  }
  return context;
};

// Función auxiliar temporal (se moverá a utils/helpers.ts)
function recalculateGroupStage(baseTeams: Team[], currentMatches: Match[]): Team[] {
  // Clonamos los equipos para resetear estadísticas
  const teamsMap = new Map(baseTeams.map(t => [t.id, { ...t, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }]));

  currentMatches.forEach(m => {
    if (m.stage !== 'group' || m.homeScore === null || m.awayScore === null) return;
    if (!m.homeTeam || !m.awayTeam) return;

    const home = teamsMap.get(m.homeTeam.id);
    const away = teamsMap.get(m.awayTeam.id);

    if (home && away) {
      home.played += 1;
      away.played += 1;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.won += 1; home.points += 3;
        away.lost += 1;
      } else if (m.homeScore < m.awayScore) {
        away.won += 1; away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1; home.points += 1;
        away.drawn += 1; away.points += 1;
      }
      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    }
  });

  return Array.from(teamsMap.values());
}