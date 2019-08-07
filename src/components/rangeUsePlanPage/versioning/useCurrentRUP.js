import React from 'react'
import { useContext } from 'react'

export const CurrentRUPContext = React.createContext()

export default function useCurrentRUPContext() {
  const rupId = useContext(CurrentRUPContext)
  return rupId
}
