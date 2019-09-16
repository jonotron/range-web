import * as Yup from 'yup'
import moment from 'moment'

const handleNull = (defaultValue = '') => v => (v === null ? defaultValue : v)

const RUPSchema = Yup.object().shape({
  rangeName: Yup.string(),
  altBusinessName: Yup.string().transform(handleNull()),
  planStartDate: Yup.string().required(),
  planEndDate: Yup.string().required(),
  pastures: Yup.array().of(
    Yup.object().shape({
      allowableAum: Yup.number().nullable(),
      graceDays: Yup.number(),
      name: Yup.string().required('Please enter a name'),
      notes: Yup.string().nullable(),
      planId: Yup.number(),
      pldPercent: Yup.number()
        .typeError('Please enter a number')
        .nullable(),
      plantCommunities: Yup.array().of(
        Yup.object().shape({
          approved: Yup.bool().required(),
          aspect: Yup.string()
            .nullable()
            .transform(handleNull()),
          elevation: Yup.number()
            .required()
            .nullable()
            .transform(handleNull(0)),
          notes: Yup.string()
            .required()
            .transform(handleNull()),
          url: Yup.string().transform(handleNull()),
          purposeOfAction: Yup.string().required(),
          shrubUse: Yup.string().transform(handleNull()),
          rangeReadinessDate: Yup.string()
            .required()
            .default(moment().format('MMMM DD'))
        })
      )
    })
  ),
  grazingSchedules: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required(),
      narative: Yup.string()
        .required()
        .transform(handleNull()),
      grazingScheduleEntries: Yup.array().of(
        Yup.object().shape({
          dateIn: Yup.date().required(),
          dateOut: Yup.date().required()
        })
      )
    })
  )
})

export default RUPSchema
