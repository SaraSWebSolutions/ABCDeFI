import { api } from "./axiosConfig";

export const AuthService = {

  // splash screen
  getSplash: async () => {
    const response = await api.get("splash-screen/");
    return response.data;
  },

    // login
  login: async (data: any) => {
    const response = await api.post("user/login", data);
    return response.data;
  },

    // register
  register: async (data: any) => {
    const response = await api.post("user/register", data);
    return response.data;
  },

   // OtpVrify
  otpVerify: async (data: any) => {
    const response = await api.post("user/verify-otp", data);
    return response.data;
  },

    // resendOtp
  resendOtp: async (data: any) => {
    const response = await api.post("user/resend-otp", data);
    return response.data;
  },

  //Privacy
  getPrivacydata:async () => {
    const response = await api.get("privacyPolicy");
    return response.data;
  },

  //Forgot with Mobile
  forgotPassword_with_mobile:async(data:any)=>{
    const response=await api.post('user/password-change',data);
    return response.data;
  },

  // Forgot with Mobile Otp
  forgotPassword_with_mobile_verifyOtp:async(data:any)=>{
    const response=await api.post('user/password-otp',data);
    return response.data;
  },
 
  // Reset Password
  resetPassword:async(data:any)=>{
    const response=await api.post('user/password-reset',data);
    return response.data;
  }
  

};