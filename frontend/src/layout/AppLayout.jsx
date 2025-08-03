import React from "react";

const AppLayout = ({ children }) => {
  return (
    <main className="max-w-7xl mx-auto overflow-hidden">
      {children}
    </main>
  );
};

export default AppLayout;
