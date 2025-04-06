import API_URL from "../config";
import { format } from 'date-fns';

export const useFilterRiepilogoApi = () => {

  const getFilteredRiepilogo = async (beginning, end, cat) => {
    try {
      const formattedBeginning = format(beginning, 'yyyy-MM-dd HH:mm:ss');
      const formattedEnd = format(end, 'yyyy-MM-dd HH:mm:ss');

      const response = await fetch(`${API_URL}/filterRiepilogo`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify({"inizio":formattedBeginning,"fine": formattedEnd,"categoria": cat})
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

  return { getFilteredRiepilogo };
}
