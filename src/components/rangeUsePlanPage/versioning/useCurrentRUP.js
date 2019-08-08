import React from 'react'
import { useContext } from 'react'

// High up in your tree, you import the context:
//
// import {CurrentRUPContext} from './useCurrentRUP'
//
// then you provide the rupId via the provider:
//
// <CurrentRUPContext.Provider value={currentRUPId} />
//   <Components />
// </CurrentRUPContext.Provider>

// export the context so we can easily get a <CurrentRUPContext.Provider>
// component.
export const CurrentRUPContext = React.createContext()

export default function useCurrentRUP() {
  const rupId = useContext(CurrentRUPContext)

  if (rupId === undefined) {
    throw new Error(
      'useCurrentRUP must be used within a CurrentRUPContext.Provider'
    )
  }
  return rupId
}
