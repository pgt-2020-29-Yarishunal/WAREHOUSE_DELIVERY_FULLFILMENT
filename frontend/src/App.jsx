import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
