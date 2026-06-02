import { useContext } from 'react';
import { FixtureContext } from './FixtureContext';
import type { FixtureContextType } from './FixtureContext';

export const useFixture = (): FixtureContextType => {
  const context = useContext(FixtureContext);
  if (!context) {
    throw new Error('useFixture debe usarse dentro de un FixtureProvider');
  }
  return context;
};
