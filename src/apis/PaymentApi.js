import axios from "axios";

const BASEURL = 'https://learningapp-paymentmethod.vercel.app/';

export const paymentApis = (endPoint, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`${BASEURL}${endPoint}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};