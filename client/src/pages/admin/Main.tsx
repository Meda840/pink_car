import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';

// If you're using React 18 or later
import { createRoot } from 'react-dom/client';

// Import styles if needed
import './styles.css';

const container = document.getElementById('root');

// React 18+ root rendering
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// React 17 and earlier
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// Add an empty export to mark the file as a module
export {};
