let coaches = [
    { id: 1, train_id: 1, type: 'AC Tier 1', number: 'A1', seats: 48 },
    { id: 2, train_id: 1, type: 'AC Tier 2', number: 'B1', seats: 64 },
    { id: 3, train_id: 2, type: 'Sleeper', number: 'S1', seats: 72 },
  ];
  
  const coachService = {
    getAllCoaches: () => Promise.resolve({ data: coaches }),
    getCoachesByTrainId: (trainId) => Promise.resolve({ data: coaches.filter(c => c.train_id === parseInt(trainId)) }),
    getCoachById: (id) => Promise.resolve({ data: coaches.find(c => c.id === parseInt(id)) }),
    createCoach: (newCoach) => {
      const id = coaches.length > 0 ? Math.max(...coaches.map(c => c.id)) + 1 : 1;
      const coach = { id, ...newCoach };
      coaches.push(coach);
      return Promise.resolve({ data: coach });
    },
    updateCoach: (id, updatedCoach) => {
      coaches = coaches.map(c => c.id === parseInt(id) ? { ...c, ...updatedCoach } : c);
      return Promise.resolve({ data: coaches.find(c => c.id === parseInt(id)) });
    },
    deleteCoach: (id) => {
      coaches = coaches.filter(c => c.id !== parseInt(id));
      return Promise.resolve({ message: 'Coach deleted successfully' });
    },
  };
  
  export default coachService;