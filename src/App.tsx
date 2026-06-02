import { useState, useEffect } from 'react';
import { FixtureProvider } from './context/FixtureContext';
import { MatchList } from './features/matches/components/MatchList';
import { GroupGrid } from './features/groups/components/GroupGrid';
import { KnockoutStage } from './features/bracket/components/KnockoutStage';
import { Button } from './components/Button';

type TabType = 'matches' | 'groups' | 'bracket';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('matches');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  useEffect(() => {
    // Modern Web Guidance: use native color-scheme property which controls the light-dark() CSS function
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab) return;
    // Modern Web Guidance: Use View Transitions API for smooth morphing/crossfading between tabs
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setActiveTab(newTab);
      });
    } else {
      setActiveTab(newTab);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header Panel */}
      <header className="app-header">
        <div className="header-title-group">
          <span className="header-badge">Copa Mundial FIFA 2026</span>
          <h1 className="app-title">Fixture Mundial 2026</h1>
          <p className="app-subtitle">
            Partidos, posiciones de grupos y eliminatorias de Estados Unidos, Canadá y México
          </p>
        </div>

        {/* Simulation Actions */}
        <div className="simulator-actions-panel">
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </Button>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="navbar-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'matches' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('matches')}
        >
          ⚽ Partidos & Resultados
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'groups' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('groups')}
        >
          📋 Tablas de Grupos
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'bracket' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('bracket')}
        >
          🌳 Fase Eliminatoria
        </button>
      </nav>

      {/* Feature Views */}
      <main className="app-main-content">
        {activeTab === 'matches' && <MatchList />}
        {activeTab === 'groups' && <GroupGrid />}
        {activeTab === 'bracket' && <KnockoutStage />}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '64px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-glass)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <p>Fixture Web de la Copa Mundial 2026 &copy; José Luis Vegas Márquez, {new Date().getFullYear()}</p>
        <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
          Sedes oficiales: Atlanta, Boston, Ciudad de México, Dallas, Guadalajara, Houston, Kansas City, Los Ángeles, Miami, Monterrey, Nueva York, Filadelfia, San Francisco, Seattle, Toronto, Vancouver.
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <FixtureProvider>
      <Dashboard />
    </FixtureProvider>
  );
}

export default App;
