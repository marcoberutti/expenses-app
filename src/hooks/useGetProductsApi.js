import API_URL from "../config";

export const useGetProductsApi = () => {

  const getProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/getProductsForSelect`,{
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

  return { getProducts };
}
