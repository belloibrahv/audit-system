import * as yup from 'yup';

export const auditPlanSchema = yup.object().shape({
  projectName: yup.string()
    .required('Project name is required')
    .min(3, 'Project name must be at least 3 characters'),
  auditType: yup.string()
    .required('Audit type is required')
    .oneOf(['risk-based', 'compliance', 'operational', 'internal'], 'Invalid audit type'),
  owner: yup.string()
    .required('Owner is required'),
  location: yup.string()
    .required('Location is required'),
  personnel: yup.array()
    .of(yup.string())
    .default([]),
  entities: yup.array()
    .of(yup.string())
    .default([]),
  frequency: yup.string()
    .required('Frequency is required')
    .oneOf(['quarterly', 'bi-annually', 'annually', 'adhoc'], 'Invalid frequency'),
  startDate: yup.string()
    .required('Start date is required'),
  endDate: yup.string()
    .required('End date is required'),
  processes: yup.string()
    .required('Processes are required'),
  units: yup.string()
    .required('Units are required')
});

export type AuditPlanFormData = yup.InferType<typeof auditPlanSchema>;