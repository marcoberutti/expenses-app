import API_URL from "../config";

export const useCreateEventApi = () => {
  const createEvent = async (titolo, data, colore) => {
    try {
      
      const response = await fetch(`${API_URL}/createEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify({
          title: titolo,  // Assicurati che il backend si aspetti questa chiave
          start: data, // Nome corretto per il backend
          color: colore
        })
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta dal server");
      }
      
      const result = await response.json();
      return result;
      
    } catch (err) {
      console.error("Errore nel createEvent:", err);
      throw err;
    }
  };

  return { createEvent };
};
