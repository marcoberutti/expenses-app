import API_URL from "../config";

export const useCreateCustomerApi = () => {
  const createCustomer = async (data) => {
    try {
      
      const response = await fetch(`${API_URL}/createCustomer`, {
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
      console.error("Errore nella creazione del cliente:", err);
      throw err;
    }
  };

  return { createCustomer };
};
