import API_URL from "../config";

export const usePopulateProductApi = () => {
  const populateProduct = async (prodotto, prezzo) => {
    try {
      const response = await fetch(`${API_URL}/populateListaProdotti`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify({"prodotto": prodotto, "prezzo": parseFloat(prezzo)})
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { populateProduct };
};
