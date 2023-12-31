import { IPatient, IUsersAddress, IWorker } from '../@autogenerated';

export enum AppointmentStatusTypes {
  PENDING = 'pending',
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum ScheduleItineraryTypes {
  RECURRENT = 'recurrent',
  EVENTUAL = 'eventual',
}

export interface IAppointment {
  patient: IPatient;
  worker?: IWorker;
  itineraryId: string;
  itineraryType: ScheduleItineraryTypes;
  start: Date;
  end: Date;
  userAddress: IUsersAddress;
  appointmentStatus: AppointmentStatusTypes;
}
