let trains = [
  {
    id: 1,
    train_number: "TRN-101",
    name: "Superfast Express",
    source: "Mumbai",
    destination: "Delhi",
    departure_time: "08:00",
    coaches: ["Sleeper", "AC 3-tier"],
  },
  {
    id: 2,
    train_number: "TRN-202",
    name: "Rajdhani Express",
    source: "Kolkata",
    destination: "Chennai",
    departure_time: "12:30",
    coaches: ["AC 1-tier", "AC 2-tier"],
  },
  {
    id: 3,
    train_number: "TRN-303",
    name: "Shatabdi Express",
    source: "Delhi",
    destination: "Jaipur",
    departure_time: "16:45",
    coaches: ["Chair Car", "Executive Chair Car"],
  },
];

const trainService = {
  getAllTrains: () => Promise.resolve({ data: trains }),

  getTrainById: (id) =>
    Promise.resolve({ data: trains.find((t) => t.id === parseInt(id)) }),

  createTrain: (newTrain) => {
    const id = trains.length > 0 ? Math.max(...trains.map((t) => t.id)) + 1 : 1;
    const train = { id, coaches: [], ...newTrain }; // default coaches empty if not provided
    trains.push(train);
    return Promise.resolve({ data: train });
  },

  updateTrain: (id, updatedTrain) => {
    trains = trains.map((t) =>
      t.id === parseInt(id) ? { ...t, ...updatedTrain } : t
    );
    return Promise.resolve({ data: trains.find((t) => t.id === parseInt(id)) });
  },

  deleteTrain: (id) => {
    trains = trains.filter((t) => t.id !== parseInt(id));
    return Promise.resolve({ message: "Train deleted successfully" });
  },
};

export default trainService;
