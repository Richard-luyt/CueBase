import { useState, useEffect } from 'react';
import { getStoredAuth } from './api';
import AuthView from './AuthView';
import DashboardView from './DashboardView';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const { token, user } = getStoredAuth();
    if (token) setAuth({ token, user });
  }, []);

  return (
    <>
      {auth ? (
        <DashboardView user={auth.user} onLogout={() => setAuth(null)} />
      ) : (
        <AuthView onAuth={setAuth} />
      )}
    </>
  );
}

export default App;
