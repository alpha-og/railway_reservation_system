/*// Mock data for trains
let mockTrains = [
  {
    id: 'train-1',
    train_number: '123A',
    name: 'Express One',
    source: 'City A',
    destination: 'City B',
    departure_time: '10:00 AM',
  },
  {
    id: 'train-2',
    train_number: '456B',
    name: 'Superfast Two',
    source: 'City C',
    destination: 'City D',
    departure_time: '02:30 PM',
  },
];

const trainService = {
  // GET all trains
  getAllTrains: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockTrains });
      }, 500);
    });
  },

  // GET a single train by ID
  getTrainById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const train = mockTrains.find(t => t.id === id);
        if (train) {
          resolve({ data: train });
        } else {
          reject({ response: { status: 404, data: 'Train not found' } });
        }
      }, 500);
    });
  },

  // POST (Create) a new train
  createTrain: async (trainData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrain = { ...trainData, id: `train-${Date.now()}` };
        mockTrains.push(newTrain);
        resolve({ data: newTrain });
      }, 500);
    });
  },

  // PUT (Update) an existing train
  updateTrain: async (id, trainData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTrains.findIndex(t => t.id === id);
        if (index !== -1) {
          mockTrains[index] = { ...trainData, id };
          resolve({ data: mockTrains[index] });
        } else {
          reject({ response: { status: 404, data: 'Train not found' } });
        }
      }, 500);
    });
  },

  // DELETE a train
  deleteTrain: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTrains = mockTrains.filter(train => train.id !== id);
        resolve({ status: 204 });
      }, 500);
    });
  },
};

export default trainService;*/

let trains = [
  { id: 1, train_number: 'TRN-101', name: 'Superfast Express', source: 'Mumbai', destination: 'Delhi', departure_time: '08:00' },
  { id: 2, train_number: 'TRN-202', name: 'Rajdhani Express', source: 'Kolkata', destination: 'Chennai', departure_time: '12:30' },
  { id: 3, train_number: 'TRN-303', name: 'Shatabdi Express', source: 'Delhi', destination: 'Jaipur', departure_time: '16:45' },
];

const trainService = {
  getAllTrains: () => Promise.resolve({ data: trains }),
  getTrainById: (id) => Promise.resolve({ data: trains.find(t => t.id === parseInt(id)) }),
  createTrain: (newTrain) => {
    const id = trains.length > 0 ? Math.max(...trains.map(t => t.id)) + 1 : 1;
    const train = { id, ...newTrain };
    trains.push(train);
    return Promise.resolve({ data: train });
  },
  updateTrain: (id, updatedTrain) => {
    trains = trains.map(t => t.id === parseInt(id) ? { ...t, ...updatedTrain } : t);
    return Promise.resolve({ data: trains.find(t => t.id === parseInt(id)) });
  },
  deleteTrain: (id) => {
    trains = trains.filter(t => t.id !== parseInt(id));
    return Promise.resolve({ message: 'Train deleted successfully' });
  },
};

export default trainService;