import { normalize } from 'normalizr';
import uuid from 'uuid-v4';
import { success, request, error, storePlan } from '../actions';
import { UPDATE_PLAN_STATUS_SUCCESS, UPDATE_AGREEMENT_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';
import * as schema from './schema';
import { axios, createConfigWithHeader } from '../utils';
import { getPasturesMap, getGrazingSchedulesMap, getMinisterIssuesMap } from '../reducers/rootReducer';

/* eslint-disable arrow-body-style */
export const updateRUP = (planId, body) => (dispatch, getState) => {
  return axios.put(
    API.UPDATE_RUP(planId),
    body,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      const plan = response.data;
      return plan;
    },
    (err) => {
      dispatch(toastErrorMessage(err));
      return err;
    },
  );
};

export const createRUP = plan => (dispatch, getState) => {
  // dispatch(actions.request(reducerTypes.UPDATE_CLIENT_ID_OF_USER));
  return axios.post(
    API.CREATE_RUP,
    plan,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      const plan = response.data;
      // dispatch(actions.success(reducerTypes., plan));
      // dispatch(toastSuccessMessage());
      return plan;
    },
    (err) => {
      // dispatch(actions.error(reducerTypes., err));
      dispatch(toastErrorMessage(err));
      return err;
    },
  );
};

export const createRUPPasture = (planId, pasture) => (dispatch, getState) => {
  return axios.post(
    API.CREATE_RUP_PASTURE(planId),
    pasture,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      const pasture = response.data;
      // dispatch(actions.success(reducerTypes., pasture));
      // dispatch(toastSuccessMessage());
      return pasture;
    },
    (err) => {
      // dispatch(actions.error(reducerTypes., err));
      dispatch(toastErrorMessage(err));
      return err;
    },
  );
};

export const createRUPGrazingScheduleEntry = (planId, grazingScheduleId, entry) => (dispatch, getState) => {
  return axios.post(
    API.CREATE_RUP_GRAZING_SCHEDULE_ENTRY(planId, grazingScheduleId),
    { ...entry, plan_id: planId },
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      return err;
    },
  );
};

export const createRUPGrazingSchedule = (planId, schedule) => (dispatch, getState) => {
  const makeRequest = async () => {
    try {
      const { data: newSchedule } = await axios.post(
        API.CREATE_RUP_GRAZING_SCHEDULE(planId),
        { ...schedule, grazingScheduleEntries: [], plan_id: planId },
        createConfigWithHeader(getState),
      );
      const gses = await Promise.all(schedule.grazingScheduleEntries
        .map(gse => dispatch(createRUPGrazingScheduleEntry(planId, newSchedule.id, gse))));

      return {
        ...newSchedule,
        grazingScheduleEntries: gses,
      };
    } catch (err) {
      return err;
    }
  };
  return makeRequest();
};

// export const createRUPMinisterIssue = (planId, issue) => (dispatch, getState) => {

// }

export const createAmendment = plan => (dispatch, getState) => {
  const makeRequest = async () => {
    try {
      const pasturesMap = getPasturesMap(getState());
      const grazingSchedulesMap = getGrazingSchedulesMap(getState());
      const ministerIssuesMap = getMinisterIssuesMap(getState());

      // copy and create new entities without ids
      const pastures = plan.pastures.map((pId) => {
        const { id, planId, ...pasture } = pasturesMap[pId];
        return pasture;
      });
      const grazingSchedules = plan.grazingSchedules.map((gsId) => {
        const { id, planId, ...grazingSchedule } = grazingSchedulesMap[gsId];
        const newGrazingScheduleEntries = grazingSchedule.grazingScheduleEntries.map((e) => {
          const { id, ...newGrazingScheduleEntry } = e;
          return newGrazingScheduleEntry;
        });
        return {
          ...grazingSchedule,
          grazingScheduleEntries: newGrazingScheduleEntries,
        };
      });
      // const ministerIssues = plan.ministerIssues.map((miId) => {
      //   const { id, planId, ...ministerIssue } = ministerIssuesMap[miId];
      //   return ministerIssue;
      // });

      const amendment = await dispatch(createRUP(plan));
      const newPastures = await Promise.all(pastures.map(np => dispatch(createRUPPasture(amendment.id, np))));
      const newGrazingSchedules = await Promise.all(grazingSchedules.map(ngs => dispatch(createRUPGrazingSchedule(amendment.id, ngs))));
      // await Promise.all(ministerIssues.map(p => dispatch(createPasture(amendment.id, p))));

      // successfully finish uploading!
      await dispatch(updateRUP(amendment.id, { uploaded: true }));

      return {
        ...amendment,
        pastures: newPastures,
        grazingSchedules: newGrazingSchedules,
      };
    } catch (err) {
      return err;
    }
  };
  return makeRequest();
};

export const fetchRUP = planId => (dispatch, getState) => {
  dispatch(request(reducerTypes.GET_PLAN));
  const makeRequest = async () => {
    try {
      const response = await axios.get(API.GET_RUP(planId), createConfigWithHeader(getState));
      const { plan, ...agreement } = response.data;
      const planWithAgreement = {
        ...plan,
        agreement,
      };

      dispatch(success(reducerTypes.GET_PLAN, response.data));
      // store the plan object
      dispatch(storePlan(normalize(planWithAgreement, schema.plan)));

      // return the agreement data for view
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.GET_PLAN, err));
      throw err;
    }
  };
  return makeRequest();
};

export const updateRUPStatus = (planId, statusId, shouldToast = true) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_PLAN_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_PLAN_STATUS(planId),
        { statusId },
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_PLAN_STATUS, response.data));
      if (shouldToast) {
        dispatch(toastSuccessMessage(UPDATE_PLAN_STATUS_SUCCESS));
      }
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_PLAN_STATUS, err));
      if (shouldToast) {
        dispatch(toastErrorMessage(err));
      }
      throw err;
    }
  };
  return makeRequest();
};

export const updateAgreementZone = ({ agreementId, zoneId }) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_AGREEMENT_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_AGREEMENT_ZONE(agreementId),
        { zoneId },
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_AGREEMENT_ZONE, response.data));
      dispatch(toastSuccessMessage(UPDATE_AGREEMENT_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_AGREEMENT_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const fetchRupPDF = planId => (dispatch, getState) => {
  dispatch(request(reducerTypes.GET_PLAN_PDF));
  const makeRequest = async () => {
    try {
      const config = {
        ...createConfigWithHeader(getState),
        responseType: 'arraybuffer',
      };
      const { data } = await axios.get(API.GET_PLAN_PDF(planId), config);
      dispatch(success(reducerTypes.GET_PLAN_PDF, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.GET_PLAN_PDF, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const createRupGrazingScheduleAndEntries = (planId, schedule) => (dispatch, getState) => {
  dispatch(request(reducerTypes.CREATE_RUP_GRAZING_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { id, ...grazingSchedule } = schedule;
      const { data } = await axios.post(
        API.CREATE_RUP_GRAZING_SCHEDULE(planId),
        { ...grazingSchedule, plan_id: planId },
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.CREATE_RUP_GRAZING_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.CREATE_RUP_GRAZING_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const updateRupGrazingScheduleAndEntries = (planId, schedule) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_RUP_GRAZING_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        API.UPDATE_RUP_GRAZING_SCHEDULE(planId, schedule.id),
        { ...schedule },
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_RUP_GRAZING_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_RUP_GRAZING_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const createOrUpdateRupGrazingSchedule = (planId, schedule) => (dispatch) => {
  if (uuid.isUUID(schedule.id)) {
    return dispatch(createRupGrazingScheduleAndEntries(planId, schedule));
  }
  return dispatch(updateRupGrazingScheduleAndEntries(planId, schedule));
};

export const deleteRupGrazingSchedule = (planId, scheduleId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_GRAZING_SCHEUDLE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_GRAZING_SCHEDULE(planId, scheduleId),
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_GRAZING_SCHEUDLE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_GRAZING_SCHEUDLE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const deleteRupGrazingScheduleEntry = (planId, scheduleId, entryId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_GRAZING_SCHEDULE_ENTRY(planId, scheduleId, entryId),
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};
