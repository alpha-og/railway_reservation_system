import client from "../../../../services/config/axiosClient.js";

async function getCoachTypes() {
  const response = await client.get("/coach-types");
  return response.data.data.coachTypes;
}

async function getCoachTypeById(id) {
  const response = await client.get(`/coach-types/${id}`);
  return response.data.data.coachType;
}

// Fallback coach type data with pricing
const fallbackCoachTypes = [
  { 
    id: "1", 
    name: "AC 1 Tier", 
    basePrice: 1500,
    base_price: 1500,
    description: "AC 1 Tier",
    available_seats: 18 
  },
  { 
    id: "2", 
    name: "AC 2 Tier", 
    basePrice: 1200,
    base_price: 1200,
    description: "AC 2 Tier",
    available_seats: 45 
  },
  { 
    id: "3", 
    name: "AC 3 Tier", 
    basePrice: 1000,
    base_price: 1000,
    description: "AC 3 Tier",
    available_seats: 62 
  },
  { 
    id: "4", 
    name: "Sleeper Class", 
    basePrice: 800,
    base_price: 800,
    description: "Sleeper Class",
    available_seats: 72 
  },
  { 
    id: "5", 
    name: "AC Chair Car", 
    basePrice: 700,
    base_price: 700,
    description: "AC Chair Car",
    available_seats: 75 
  },
  { 
    id: "6", 
    name: "General", 
    basePrice: 400,
    base_price: 400,
    description: "General Class",
    available_seats: 120 
  }
];

// Helper function to get base price for a coach type
// NOTE: This is now primarily used as fallback when real fare calculation API is not available
// Real fare calculation should use fare.service.js with backend API
function getCoachTypePrice(coachTypeName, coachTypesData = null) {
  // First try to get from API data
  if (coachTypesData && Array.isArray(coachTypesData)) {
    const coachType = coachTypesData.find(ct => ct.name === coachTypeName);
    if (coachType && (coachType.base_price || coachType.basePrice)) {
      return coachType.base_price || coachType.basePrice;
    }
  }
  
  // Fallback to predefined pricing based on coach type name
  const priceMapping = {
    "AC 1 Tier": 1500,
    "AC 2 Tier": 1200,
    "AC 3 Tier": 1000,
    "Sleeper Class": 800,
    "AC Chair Car": 700,
    "General": 400,
    // Legacy mappings for backwards compatibility
    "AC": 1200,
    "Sleeper": 800
  };
  
  return priceMapping[coachTypeName] || 400;
}

// Helper function to normalize coach type names for frontend display
function normalizeCoachTypeName(backendName) {
  const nameMapping = {
    "AC 1 Tier": "AC 1 Tier",
    "AC 2 Tier": "AC 2 Tier", 
    "AC 3 Tier": "AC 3 Tier",
    "Sleeper Class": "Sleeper",
    "AC Chair Car": "AC Chair Car",
    "General": "General"
  };
  
  return nameMapping[backendName] || backendName;
}

export default {
  getCoachTypes,
  getCoachTypeById,
  fallbackCoachTypes,
  getCoachTypePrice,
  normalizeCoachTypeName,
};
