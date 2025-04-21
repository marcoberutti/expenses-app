import API_URL from "../config";

export const useWriteProductPrezzoApi = () => {

  const writeProductPrezzo = async (prezzo, id) => {
    try {
      const response = await fetch(`${API_URL}/writeProductListPrezzo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify({"prezzo": prezzo})
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta dal server");
      }
      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { writeProductPrezzo };
}