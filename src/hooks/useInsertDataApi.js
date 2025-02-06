import API_URL from "../config";

export const useInsertDataApi = () => {
  const insertData = async (data) => {
    try {
      const response = await fetch(`${API_URL}/newExpense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify(data)
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

  return { insertData };
};
