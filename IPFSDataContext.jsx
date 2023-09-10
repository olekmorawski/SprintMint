import React, { createContext, useState } from "react";

export const IPFSDataContext = createContext();

export const IPFSDataProvider = ({ children }) => {
  const [ipfsData, setIpfsData] = useState({
    ipfsLink: "",
    metadata: {},
  });

  return (
    <IPFSDataContext.Provider value={{ ipfsData, setIpfsData }}>
      {children}
    </IPFSDataContext.Provider>
  );
};
