import React, { useState, useEffect } from 'react';
import LinkList from './components/LinkList';
import DateCounter from './components/DateCounter';
import Goals from './components/Goals';
import Dashboard from './layouts/index';

function App() {
  return (
    <div className="App">
      {/* <LinkList/> */}
      {/* <DateCounter/> */}
      {/* <Goals/> */}
      <Dashboard/>
    </div>
  );
}

export default App;
