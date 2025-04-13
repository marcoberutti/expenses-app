import React from 'react'
import { useData } from '../../dataContext'
import style from "./Intestazione.module.css"

export default function Message(){

  const {message} = useData()

  return(
    <>
      {message !== '' && (
        <h4 className={style.successAlert}>
          {typeof message === 'string' ? message : JSON.stringify(message)}
        </h4>
      )}
    </>
  )
}