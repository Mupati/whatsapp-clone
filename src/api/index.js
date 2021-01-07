import axios from "axios";

const Api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
});

Api.defaults.withCredentials = true;

const tokenName = process.env.VUE_APP_TOKEN_NAME;

export const doRegister = async data => {
  return Api.post("/register", data);
};

export const doLogin = async data => {
  return Api.post("/login", data);
};

export const doLogout = async () => {
  try {
    await Api.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );
    clearToken();
  } catch (error) {
    console.log(error);
  }
};

export const getUser = () =>
  Api.get("/user", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

export const storeToken = token => {
  localStorage.setItem(tokenName, token);
};

export const clearToken = () => {
  localStorage.removeItem(tokenName);
};

export const getToken = () => localStorage.getItem(tokenName);
