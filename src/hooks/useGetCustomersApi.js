import API_URL from "../config";

export const useGetCustomersApi = () => {

  const getCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/getCustomers`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        }
      })

      if (!response.ok) {
        throw new Error("Errore nella risposta dal server");
      }
      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { getCustomers };
}
