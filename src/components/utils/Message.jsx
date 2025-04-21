import React from 'react'
import style from "./Intestazione.module.css"
import { useSharedState } from '../../sharedStateContext'

export default function Message(){

  const {message} = useSharedState()

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