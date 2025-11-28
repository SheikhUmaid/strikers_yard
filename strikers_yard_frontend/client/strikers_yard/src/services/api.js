import axios from  "axios";


// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";



const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL, withCredentials: true,
});



// / Response interceptor for all APIs
const handleResponse = (response) => response;
const handleError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
  console.error('API Error:', error);
  return Promise.reject(error);
};

authAPI.interceptors.response.use(handleResponse, handleError);

// authAPI.interceptors.request.use((config) => {
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }else{
    
  }
  return config;
});



export const updateUserDetails = (data) =>{
  return authAPI.post("/set-name-email/", data);
}


export const registerUser = (phone_number) => {
  return authAPI.post("/auth/request-otp/", { phone_number });
};


export const verifyOTP = (phone_number, otp) => {
  return authAPI.post("/auth/verify-otp/", { phone_number, otp });
}

// Inside your existing axios service file

export const fetchSports = () => {
  return authAPI.get("/services/");
};
// services.js (or axios service file)

export const fetchSlots = (date, serviceId) => {
  return authAPI.get('/slots/', {
    params: { date, service_id: serviceId }
  });
};
export const createBooking = (bookingData) => {
  return authAPI.post('/bookings/', bookingData);
};

export const verifyPayment = (payload) => {
  return authAPI.post('/verify-payment/', payload);
};


export const fetchMyBookings = () => {
  return authAPI.get("/my-bookings/");
};