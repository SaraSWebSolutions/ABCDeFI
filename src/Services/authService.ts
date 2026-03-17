import { api } from "./axiosConfig";

export const AuthService = {

//   // login
//   login: async (data: any) => {
//     const response = await api.post("login", data);
//     return response.data;
//   },

//   // register
//   register: async (data: any) => {
//     const response = await api.post("register", data);
//     return response.data;
//   },

//   // get profile
//   profile: async () => {
//     const response = await api.get("profile");
//     return response.data;
//   },

  // splash screen
  splashScreen: async () => {
    const response = await api.get("splash-screen/");
    return response.data;
  },

};