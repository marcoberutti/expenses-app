import API_URL from "../config";

export const useCreateMaterialApi = () => {
  const createMaterial = async (data) => {
    try {
      
      const response = await fetch(`${API_URL}/createMaterial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta dal server");
      }
      
      const result = await response.json();
      return result;
      
    } catch (err) {
      console.error("Errore nella creazione del materiale:", err);
      throw err;
    }
  };

  return { createMaterial };
};
