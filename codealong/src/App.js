import React from 'react';
import logo from './logo.svg';
import './App.css';
import PersonListingsGet from './components/PersonListingsGet'
import PersonListingsPost from './components/PersonListingsPost'
import PersonListingsDel from './components/PersonListingsDel'

function App() {
  return (
    <div className="App">
      <PersonListingsGet />
      <PersonListingsPost />
      <PersonListingsDel />
    </div>
  );
}

export default App;
