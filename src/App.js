import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <AppRouter />
      </Layout>
    </Router>
  );
}

export default App;
