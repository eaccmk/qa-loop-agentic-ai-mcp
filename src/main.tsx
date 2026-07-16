import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

type Theme = 'light' | 'dark';
type View = 'login' | 'home' | 'settings';

const products = [
  'Test Runs',
  'Bug Triage',
  'Visual Checks',
  'Smoke Suites',
  'API Monitoring',
  'Accessibility',
  'Analytics',
  'Release Gates',
  'Playwright Packs',
  'Sandbox Tools'
];

function readStoredTheme(): Theme {
  const value = window.localStorage.getItem('theme');
  return value === 'dark' ? 'dark' : 'light';
}

function readStoredSession(): boolean {
  return window.localStorage.getItem('session') === 'active';
}

function App() {
  const [theme, setTheme] = React.useState<Theme>(readStoredTheme);
  const [isSignedIn, setIsSignedIn] = React.useState(readStoredSession);
  const [view, setView] = React.useState<View>(readStoredSession() ? 'home' : 'login');
  const [profile, setProfile] = React.useState({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    currency: 'USD',
    password: '********'
  });
  const [status, setStatus] = React.useState('Development sandbox: QA loop in progress.');

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  React.useEffect(() => {
    window.localStorage.setItem('session', isSignedIn ? 'active' : 'inactive');
  }, [isSignedIn]);

  const signIn = () => {
    setIsSignedIn(true);
    setView('home');
    setStatus('Signed in with mocked Google SSO.');
  };

  const logout = () => {
    setIsSignedIn(false);
    setView('login');
    setStatus('Signed out.');
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">QA Loop Demo</div>
          <div className="subtitle">Development page for Playwright-MCP driven product work</div>
        </div>
        <div className="topbar-actions">
          <button className="theme-switch" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {isSignedIn && (
            <button className="profile-chip" onClick={() => setView('settings')}>
              {profile.name}
            </button>
          )}
        </div>
      </header>

      <main className="content">
        {!isSignedIn && view === 'login' && <LoginPage onSignIn={signIn} />}
        {isSignedIn && view === 'home' && (
          <HomePage status={status} onOpenSettings={() => setView('settings')} />
        )}
        {isSignedIn && view === 'settings' && (
          <SettingsPage
            profile={profile}
            setProfile={setProfile}
            onBack={() => setView('home')}
            onLogout={logout}
          />
        )}
      </main>
    </div>
  );
}

function LoginPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <section className="auth-card">
      <div className="auth-art">
        <div className="hero-mark">G</div>
        <h1>Sign in</h1>
        <p>Use the Google-style sign in flow for this sample workspace.</p>
      </div>
      <div className="auth-form">
        <h2>Welcome back</h2>
        <p className="muted">Continue with your account to enter the storefront.</p>
        <label>
          Email or phone
          <input type="email" defaultValue="alex@example.com" />
        </label>
        <label>
          Password
          <input type="password" defaultValue="password123" />
        </label>
        <button className="primary" onClick={onSignIn}>
          Continue with Google
        </button>
        <button className="secondary" onClick={onSignIn}>
          Use test account
        </button>
      </div>
    </section>
  );
}

function HomePage({ status, onOpenSettings }: { status: string; onOpenSettings: () => void }) {
  return (
    <section className="home">
      <div className="hero">
        <div className="hero-copy">
          <div className="badge">Development storefront</div>
          <h1>Sell tooling with a strong first impression.</h1>
          <p>
            This page is intentionally built as a live QA loop surface. It is meant to keep changing
            while Playwright checks the user-facing behaviors that matter.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onOpenSettings}>
              Open profile settings
            </button>
            <span className="status-pill">{status}</span>
          </div>
        </div>
        <div className="hero-image" aria-label="Hero banner image">
          <div className="hero-image-overlay">
            <span>Cloud-ready QA tools</span>
          </div>
        </div>
      </div>
      <div className="section-head">
        <h2>10 tools for sale</h2>
        <p>Tiles below are placeholders for the products this storefront will eventually offer.</p>
      </div>
      <div className="tile-grid">
        {products.map((product) => (
          <article className="tile" key={product}>
            <div className="tile-icon" />
            <h3>{product}</h3>
            <p>Bundled features, team access, and usage tracking.</p>
            <button className="tile-button">View product</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsPage({
  profile,
  setProfile,
  onBack,
  onLogout
}: {
  profile: { name: string; email: string; currency: string; password: string };
  setProfile: React.Dispatch<
    React.SetStateAction<{ name: string; email: string; currency: string; password: string }>
  >;
  onBack: () => void;
  onLogout: () => void;
}) {
  return (
    <section className="settings">
      <div className="section-head compact">
        <div>
          <h2>User profile settings</h2>
          <p>Update account details, then return to the storefront.</p>
        </div>
        <button className="secondary" onClick={onBack}>
          Back to home
        </button>
      </div>
      <div className="settings-grid">
        <label>
          Update profile
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </label>
        <label>
          Update email
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </label>
        <label>
          Update password
          <input
            type="password"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
        </label>
        <label>
          Currency
          <select value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value })}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>JPY</option>
          </select>
        </label>
      </div>
      <div className="settings-actions">
        <button className="primary" onClick={() => setProfile({ ...profile })}>
          Save changes
        </button>
        <button className="danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
