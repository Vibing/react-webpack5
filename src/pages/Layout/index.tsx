import React from 'react';
import { Outlet } from 'react-router';

const Layout: React.FC<any> = () => {
  return (
    <div style={{ border: '20px solid pink' }}>
      <Outlet />
    </div>
  );
};

export default React.memo(Layout);
