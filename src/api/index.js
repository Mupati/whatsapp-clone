import axios from "axios";
// import Cookie from "js-cookie";

const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
});

Api.defaults.withCredentials = true;

// const fetchCookie = () => Api.get("/csrf-cookie");

// const fetchAuthToken = () => Api.get;

export const doRegister = async data => {
  return Api.post("/register", data);
};

export const doLogin = async data => {
  return Api.post("/login", data);
};

export const getUser = token =>
  Api.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const storeToken = token => {
  localStorage.setItem("wossop_token", token);
};

export const clearToken = () => {
  localStorage.removeItem("wossop_token");
};

export const getToken = () => localStorage.getItem("wossop_token");
