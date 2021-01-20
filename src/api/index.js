import axios from "axios";

export const Api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
});

Api.defaults.withCredentials = true;

const tokenName = process.env.VUE_APP_TOKEN_NAME;

export const doRegister = data => {
  return Api.post("/register", data);
};

export const doLogin = data => {
  return Api.post("/login", data);
};

export const doLogout = () =>
  Api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

export const getUser = () =>
  Api.get("/user", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

export const getUsers = () =>
  Api.get("/users", {
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

//
