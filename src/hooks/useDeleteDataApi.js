import API_URL from "../config";

export const useDeleteDataApi = () => {

  const deleteData = async (id) => {
    try {
      const response = await fetch(`${API_URL}/deleteExpense/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        }
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

  return { deleteData };
}