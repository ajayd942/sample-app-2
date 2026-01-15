import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Rsvp from './components/Rsvp';
import Events from './components/Events';
import AdminDashboard from './components/AdminDashboard';

// Placeholder components for now
const Story = () => <div className="pt-24 text-center text-2xl">Our Story</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="story" element={<Story />} />
          <Route path="events" element={<Events />} />
          <Route path="rsvp" element={<Rsvp />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
