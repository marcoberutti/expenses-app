import API_URL from "../config";

export const useGetDatasApi = () => {

  const getDatas = async (table) => {
    try {
      const response = await fetch(`${API_URL}/getDatas?table=${table}`,{
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

  return { getDatas };
}
