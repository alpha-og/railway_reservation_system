let MOCK_STATIONS = [
    { id: 1, name: 'Mumbai Central', code: 'BCT' },
    { id: 2, name: 'New Delhi', code: 'NDLS' },
    { id: 3, name: 'Bangalore City', code: 'SBC' },
  ];
  
  const getStations = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_STATIONS);
      }, 500);
    });
  };
  
  const getStation = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const station = MOCK_STATIONS.find((s) => s.id === parseInt(id));
        if (station) {
          resolve(station);
        } else {
          reject(new Error('Station not found'));
        }
      }, 500);
    });
  };
  
  const addStation = (newStation) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = MOCK_STATIONS.length ? Math.max(...MOCK_STATIONS.map(s => s.id)) + 1 : 1;
        const stationWithId = { ...newStation, id: newId };
        MOCK_STATIONS.push(stationWithId);
        resolve(stationWithId);
      }, 500);
    });
  };
  
  const updateStation = (id, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_STATIONS.findIndex((s) => s.id === parseInt(id));
        if (index !== -1) {
          MOCK_STATIONS[index] = { ...MOCK_STATIONS[index], ...updatedData };
          resolve(MOCK_STATIONS[index]);
        } else {
          reject(new Error('Station not found'));
        }
      }, 500);
    });
  };
  
  const deleteStation = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = MOCK_STATIONS.length;
        MOCK_STATIONS = MOCK_STATIONS.filter((s) => s.id !== parseInt(id));
        if (MOCK_STATIONS.length < initialLength) {
          resolve({ success: true });
        } else {
          reject(new Error('Station not found'));
        }
      }, 500);
    });
  };
  
  export { getStations, getStation, addStation, updateStation, deleteStation };