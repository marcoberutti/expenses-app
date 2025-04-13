import API_URL from "../config";

export const useGetMaterialsApi = () => {

  const getMaterials = async () => {
    try {
      const response = await fetch(`${API_URL}/getMaterials`,{
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

  return { getMaterials };
}
