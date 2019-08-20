import * as API from '../constants/api'
import { axios, createConfigWithHeader } from '../utils'
import { request, success, error } from '../actions'
import { toastErrorMessage } from './toastActionCreator'
import { CREATE_PASTURE, UPDATE_PASTURE } from '../constants/reducerTypes'
import { pastureUpdated, pastureSubmitted } from '../actions'

export const createRUPPasture = (planId, pasture) => (dispatch, getState) => {
  dispatch(request(CREATE_PASTURE))

  const { id, ...values } = pasture

  const makeRequest = async () => {
    try {
      const { data } = await axios.post(
        API.CREATE_RUP_PASTURE(planId),
        values,
        createConfigWithHeader(getState)
      )
      dispatch(success(CREATE_PASTURE, data))
      dispatch(pastureSubmitted({ id, pasture: data }))
      return data
    } catch (err) {
      dispatch(error(CREATE_PASTURE, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }

  return makeRequest()
}

export const updateRUPPasture = (planId, pasture) => (dispatch, getState) => {
  dispatch(request(UPDATE_PASTURE))

  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        API.UPDATE_RUP_PASTURE(planId, pasture.id),
        pasture,
        createConfigWithHeader(getState)
      )
      dispatch(success(UPDATE_PASTURE, data))
      dispatch(pastureUpdated({ pasture: data }))
      return data
    } catch (err) {
      dispatch(error(UPDATE_PASTURE, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }

  return makeRequest()
}

export const createOrUpdateRUPPasture = (planId, pasture) => dispatch => {
  const isEditing = Number.isInteger(pasture.id)

  if (isEditing) dispatch(updateRUPPasture(planId, pasture))
  else {
    dispatch(createRUPPasture(planId, pasture))
  }
}

export const createRUPPlantCommunityAction = (
  planId,
  pastureId,
  communityId,
  action
) => (dispatch, getState) => {
  const { id, plantCommunityId, ...data } = action

  return axios
    .post(
      API.CREATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId),
      data,
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        return response.data
      },
      err => {
        throw err
      }
    )
}

export const createRUPIndicatorPlant = (
  planId,
  pastureId,
  communityId,
  plant
) => (dispatch, getState) => {
  const { id, plantCommunityId, ...data } = plant

  return axios
    .post(
      API.CREATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId),
      data,
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        return response.data
      },
      err => {
        throw err
      }
    )
}

export const createRUPMonitoringArea = (
  planId,
  pastureId,
  communityId,
  area
) => (dispatch, getState) => {
  const { id, plantCommunityId, purposes, ...data } = area

  return axios
    .post(
      API.CREATE_RUP_MONITERING_AREA(planId, pastureId, communityId),
      data,
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        return response.data
      },
      err => {
        throw err
      }
    )
}

export const createRUPPlantCommunityAndOthers = (
  planId,
  pastureId,
  community
) => (dispatch, getState) => {
  const makeRequest = async () => {
    try {
      const { id, pastureId: pId, ...data } = community

      const { data: newPlantCommunity } = await axios.post(
        API.CREATE_RUP_PLANT_COMMUNITY(planId, pastureId),
        data,
        createConfigWithHeader(getState)
      )

      const newPcas = await Promise.all(
        community.plantCommunityActions.map(pca =>
          dispatch(
            createRUPPlantCommunityAction(
              planId,
              pastureId,
              newPlantCommunity.id,
              pca
            )
          )
        )
      )
      const newIps = await Promise.all(
        community.indicatorPlants.map(ip =>
          dispatch(
            createRUPIndicatorPlant(planId, pastureId, newPlantCommunity.id, ip)
          )
        )
      )
      const newMas = await Promise.all(
        community.monitoringAreas.map(ma =>
          dispatch(
            createRUPMonitoringArea(planId, pastureId, newPlantCommunity.id, ma)
          )
        )
      )

      return {
        ...newPlantCommunity,
        plantCommunityActions: newPcas,
        indicatorPlants: newIps,
        monitoringAreas: newMas
      }
    } catch (err) {
      throw err
    }
  }

  return makeRequest()
}
