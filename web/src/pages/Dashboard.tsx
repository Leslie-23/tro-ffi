import React from "react";
import MapDirectionsLeaflet from "../components/MapDirectionsLeaflet";
import Navbar from "../components/ui/Navbar";
const Dashboard = () => {
  return (
    <>
      <Navbar />
      <MapDirectionsLeaflet />
    </>
  );
};

export default Dashboard;
