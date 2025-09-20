import client from "../../../services/config/axiosClient.js";

// Flag to toggle mock mode
const USE_MOCK = true;

// Helper to create a fake JWT (base64 payload only, no signature needed for mock)
const createFakeJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = "mocksignature";
  return `${header}.${body}.${signature}`;
};

export default async function signIn(data) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.email === "j@e.com" && data.password === "12345678") {
          const payload = {
            id: "user_002",
            name: "Jil Varghese Palliyan",
            roleId: 2, // user role
          };
          resolve({
            token: createFakeJWT(payload),
            ...payload,
          });
        } else if (data.email === "a@e.com" && data.password === "12345678") {
          const payload = {
            id: "user_001",
            name: "Admin",
            roleId: 1, // user role
          };
          resolve({
            token: createFakeJWT(payload),
            ...payload,
          });
        } else {
          resolve({ error: "Invalid email or password" });
        }
      }, 500); // simulate network delay
    });
  }

  // Real API call
  return (await client.post("/auth/signin", data)).data;
}
