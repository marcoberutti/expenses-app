import { useState } from 'react';
import style from './loader.module.css'
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {

  const [result, setResult] = useState();

  setTimeout(() => {
    setResult("nothing")
  }, 3000);

  return (
    <div className={style.loaderContainer}>
      { result !== "nothing" ?
      <CircularProgress disableShrink color="success" />
      : 
      <p>Nessun dato disponibile</p>
      }
    </div>
  );
}