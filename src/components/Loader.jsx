import * as React from 'react';
import style from './loader.module.css'
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
  <div className={style.loaderContainer}>
    <CircularProgress disableShrink color="success" />
  </div>
);
}