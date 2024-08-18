import axios from "axios";

const baseURL = "http://localhost:8080/api/";

class Auth {
  constructor() {
    this.baseURL = baseURL;
  }

  async createUser(userData) {
    try {
      const response = await axios.post(`${baseURL}auth/register/`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async loginUser(userData){
    try{
        const response = await axios.post(`${baseURL}auth/login/`, userData, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }catch(error){
        return error.response.data;
    }
  }
}

const authService = new Auth();
export default authService;
