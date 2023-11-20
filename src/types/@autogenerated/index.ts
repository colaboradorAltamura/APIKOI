export enum CMSCollections {
  WORKER_PSICOLOGICAL_PROFILE_STATUS = 'workerPsicologicalProfileStatus',
  WORKER_PSICOLOGICAL_PROFILE = 'workerPsicologicalProfile',
  WORKER_EVALUATION_SCORES = 'workerEvaluationScores',
  WORKER_EVALUATION_STATES = 'workerEvaluationStates',
  WORKER_EVALUATIONS = 'workerEvaluations',
  QUESTIONS_TYPES = 'questionsTypes',
  PATIENT_SUPERVISION = 'patientSupervision',
  PATIENT_SUPERVISION_STATES = 'patientSupervisionStates',
  PATIENTS_CLINIC_STATE_TYPES = 'patientsClinicStateTypes',
  ENLITE_SERVICES = 'enliteServices',
  OPEN_POSITION_ASIGNMENT_STATUS_TYPES = 'openPositionAsignmentStatusTypes',
  PATIENT_GOALS_SCORES = 'patientGoalsScores',
  PATIENTS_SCHEDULES_EXCEPTION_TYPES = 'patientsSchedulesExceptionTypes',
  PATIENTS_SCHEDULES_EXCEPTIONS = 'patientsSchedulesExceptions',
  DAILY_REPORT_STATUS_TYPES = 'dailyReportStatusTypes',
  DAILY_REPORTS = 'dailyReports',
  GOAL_TYPE_CATEGORIES = 'goalTypeCategories',
  PATIENT_T_P_GOALS = 'patientTPGoals',
  GOAL_TYPES = 'goalTypes',
  PATIENTS_SCHEDULES = 'patientsSchedules',
  THERAPEUTIC_PROJECT_STATES = 'therapeuticProjectStates',
  SYMPTOM_TYPES = 'symptomTypes',
  PATIENT_THERAPEUTIC_PROJECT = 'patientTherapeuticProject',
  WORKER_ATTRIBUTES = 'workerAttributes',
  MAIL_TEMPLATES = 'mailTemplates',
  HEALTH_INSURANCE_AGREEMENTS_STATE_TYPES = 'healthInsuranceAgreementsStateTypes',
  OPEN_POSITION_STATUS_TYPES = 'openPositionStatusTypes',
  OPEN_POSITION_WORKERS = 'openPositionWorkers',
  OPEN_POSITIONS = 'openPositions',
  CAMPAIGNS = 'campaigns',
  COMPANY_EMPLOYEE_ROLE_TYPES = 'companyEmployeeRoleTypes',
  WORKER_STATE_TYPES = 'workerStateTypes',
  WORKER_AGE_PREFERENCES = 'workerAgePreferences',
  WORKER_SHIFTS_AVAILABLE_OPTIONS = 'workerShiftsAvailableOptions',
  WORKER_DAYS_AVAILABLE_OPTIONS = 'workerDaysAvailableOptions',
  PERSON_CIVIL_STATUS_TYPES = 'personCivilStatusTypes',
  PERSON_NATIONALITIES = 'personNationalities',
  WORKER_YEARS_EXPERIENCE_OPTIONS = 'workerYearsExperienceOptions',
  PATHOLOGIES_TYPES = 'pathologiesTypes',
  WORKER_EDUCATIONAL_LEVELS = 'workerEducationalLevels',
  WORKER_PROFESSION_TYPES = 'workerProfessionTypes',
  PAYMENT_CONDITION_STATE_TYPES = 'paymentConditionStateTypes',
  CURRENCIES = 'currencies',
  PATIENT_PAYMENT_CONDITIONS = 'patientPaymentConditions',
  PATIENT_HEALTH_INSURANCES = 'patientHealthInsurances',
  PATIENT_RELATIVES = 'patientRelatives',
  RELATIVES = 'relatives',
  FRUITS = 'fruits',
  USER_INTERACTION_TYPES = 'userInteractionTypes',
  CHANNEL_TYPES = 'channelTypes',
  USER_INTERACTIONS = 'userInteractions',
  APPLICANT_URGENCY_LEVES = 'applicantUrgencyLeves',
  REJECTION_CAUSES_TYPES = 'rejectionCausesTypes',
  COMPANY_EMPLOYEES = 'companyEmployees',
  COMPANIES = 'companies',
  APPLICANT_HEALTH_INSURANCE_LISTS = 'applicantHealthInsuranceLists',
  OPTION_STATE_RELATED_TEST = 'optionStateRelatedTest',
  SEX_TYPES = 'sexTypes',
  THERAPIST_TYPES = 'therapistTypes',
  HEALTH_INSURANCE_AGREEMENTS = 'healthInsuranceAgreements',
  TAX_CONDITION_TYPES = 'taxConditionTypes',
  BUSINESS_TYPES = 'businessTypes',
  QUOTATION_STATUS_TYPES = 'quotationStatusTypes',
  APPLICANT_QUOTATIONS = 'applicantQuotations',
  APPLICANT_DISPOSITIVES = 'applicantDispositives',
  PAYMENT_MODES = 'paymentModes',
  PATIENT_WORKERS = 'patientWorkers',
  WORKERS = 'workers',
  APPLICANT_SIMPLE_OPTIONS = 'applicantSimpleOptions',
  RELATIVE_TYPES = 'relativeTypes',
  GENDER_TYPES = 'genderTypes',
  PERSON_IDENTIFICATION_TYPES = 'personIdentificationTypes',
  TERAPEUT_SPECIALITY_TYPES = 'terapeutSpecialityTypes',
  USERS_ADDRESSES = 'usersAddresses',
  APPLICANTS_PROFESSIONAL_DOC_TYPE = 'applicantsProfessionalDocType',
  PATIENTS = 'patients',
  APPLICANTS_STATE_TYPES = 'applicantsStateTypes',
  APPLICANTS = 'applicants',
  PATHOLOGIES = 'pathologies',
  USERS = 'users',
}

export interface IEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  state?: number;
  '@schemaId'?: string;
}

export enum UserStatusTypes {
  USER_STATUS_TYPE_ACTIVE = 'active',
  USER_STATUS_TYPE_DEFAULTER = 'defaulter',
  USER_STATUS_TYPE_INACTIVE = 'inactive',
}

export interface IAddressObject {
  formatted_address?: string;
  address_components?: any[];
  geometry?: any;
  html_attributions?: any[];
}

export interface IAddress {
  addressString?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  postal_code?: string;
  state?: string;
  streetAndNumber?: string;
  geohash?: string;
  addressObject?: IAddressObject;
}

export interface IUserBasicData {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  state?: number;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  appUserStatus: UserStatusTypes;
  countryCode?: string;
  identificationType?: string;
  identificationNumber?: string;
  dirtyAddress?: IAddress;
}

export interface IAttachment {
  downloadURL?: string;
  refPath: string;
  path: string;
  name: string;
  size: string;
  type: string;
  extension: string;
}

export enum UserDefinedRols {
  UDR_STAFF_SEEKER = 'udr-staff-seeker',
  UDR_STAFF_COORDINATOR = 'udr-staff-coordinator',
  UDR_STAFF_CLINIC = 'udr-staff-clinic',
  UDR_STAFF_TRIAGE = 'udr-staff-triage',
  UDR_STAFF_RECRUITER = 'udr-staff-recruiter',
  UDR_RELATIVES = 'udr-relatives',
  UDR_WORKERS = 'udr-workers',
  UDR_STAFF_COMMERCIAL = 'udr-staff-commercial',
  UDR_STAFF_ADMISSION = 'udr-staff-admission',
  UDR_PATIENT = 'udr-patient',
  SYS_COMP_EMPLOYEE = 'sys-comp-employee',
}

export enum WorkerPsicologicalProfileStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export enum WorkerEvaluationStates {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export enum PatientSupervisionStates {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum PatientsClinicStateTypes {
  PENDING_PARTIAL_INFO = 'pending-partial-info',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  WAITING_PAYMENT = 'waiting-payment',
  PENDING_TRIAGE = 'pending-triage',
  PENDING_INFORMATION = 'pending-information',
}

export enum EnliteServices {
  CARE = 'care',
  CLINIC = 'clinic',
}

export enum OpenPositionAsignmentStatusTypes {
  SELECTED = 'selected',
  INTERVIEWED = 'interviewed',
  PRE_SELECTED = 'pre-selected',
  INTERESTED = 'interested',
}

export enum PatientsSchedulesExceptionTypes {
  REASIGNED = 'reasigned',
  CANCELLED = 'cancelled',
}

export enum DailyReportStatusTypes {
  AUTOGENERATED = 'autogenerated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EMPTY = 'empty',
}

export enum GoalTypeCategories {
  AREAS_TO_PROMOTE = 'areas-to-promote',
  SPECIFIC_OBJECTIVE = 'specific-objective',
}

export enum TherapeuticProjectStates {
  DONE = 'done',
  PENDING = 'pending',
}

export enum SymptomTypes {
  SUICIDAL_RISK = 'suicidal-risk',
  MANIC_EPISODE = 'manic-episode',
  DEPRESSION = 'depression',
  DIFFICULTY_WITH_SOCIAL_TIES = 'difficulty-with-social-ties',
  DIFFICULTY_WITH_MATERNAL_BONDING = 'difficulty-with-maternal-bonding',
  PEDAGOGICAL_DIFFICULTY = 'pedagogical-difficulty',
  AGGRESSIVENESS = 'aggressiveness',
}

export enum WorkerAttributes {
  STRONG = 'strong',
  CHILDREN_FRIENDLY = 'children-friendly',
}

export enum MailTemplates {
  ON_APPLICANT_STATE_CHANGE = 'on-applicant-state-change',
  WELCOME_EMAIL = 'welcome-email',
}

export enum HealthInsuranceAgreementsStateTypes {
  PENDING_APPROVAL = 'pending-approval',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export enum OpenPositionStatusTypes {
  ON_HOLD = 'on-hold',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export enum CompanyEmployeeRoleTypes {
  ADMINISTRATIVE = 'administrative',
  COMMERCIAL = 'commercial',
}

export enum WorkerStateTypes {
  PENDING_APPROVAL = 'pending-approval',
  PENDING_AVAILABILITY = 'pending-availability',
  INFORMATION_COMPLETED = 'information-completed',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  PENDING_DOCS = 'pending-docs',
  PENDING_PREFERENCES = 'pending-preferences',
  PENDING_EXPERIENCE = 'pending-experience',
  PENDING_GENERAL_INFO = 'pending-general-info',
  PENDING_INTERVIEW = 'pending-interview',
}

export enum WorkerAgePreferences {
  ADULTS = 'adults',
  ELDERLY_ADULTS = 'elderly-adults',
  TEENAGERS = 'teenagers',
  CHILDREN = 'children',
}

export enum WorkerShiftsAvailableOptions {
  AFTERNOON_SHIFT_TIME = 'afternoon-shift-time',
  MORNING_SHIFT_TIME = 'morning-shift-time',
  NIGHT_SHIFT_TIME = 'night-shift-time',
}

export enum WorkerDaysAvailableOptions {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export enum PersonCivilStatusTypes {
  WIDOWED = 'widowed',
  DIVORCED = 'divorced',
  MARRIED = 'married',
  SINGLE = 'single',
}

export enum PersonNationalities {
  BRAZILIAN = 'brazilian',
  ARGENTINIAN = 'argentinian',
}

export enum WorkerYearsExperienceOptions {
  MORE_THAN_FIVE_YEARS = 'more-than-five-years',
  FOUR_YEARS = 'four-years',
  THREE_YEARS = 'three-years',
  TWO_YEARS = 'two-years',
  ONE_YEAR = 'one-year',
  WITHOUT_EXPERIENCE = 'without-experience',
}

export enum PathologiesTypes {
  SOCIAL = 'social',
  PSYCHIATRIC = 'psychiatric',
  PEDAGOGICAL = 'pedagogical',
  OTHER = 'other',
  NEUROLOGICAL = 'neurological',
  DISABILITY = 'disability',
}

export enum WorkerEducationalLevels {
  PRIMARY_SCHOOL = 'primary-school',
  SECONDARY_SCHOOL = 'secondary-school',
  TERTIARY_EDUCATION = 'tertiary-education',
  COLLEGE_DEGREE = 'college-degree',
  DOCTORATE = 'doctorate',
  MASTERS_DEGREE = 'masters-degree',
  POSTGRADUATE = 'postgraduate',
}

export enum WorkerProfessionTypes {
  OTHER = 'other',
  PSYCHOLOGIST = 'psychologist',
  PSYCHOLOGY_STUDENT = 'psychology-student',
  CARER = 'carer',
  THERAPEUTIC_COMPANION = 'therapeutic-companion',
}

export enum PaymentConditionStateTypes {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  NEAR_EXPIRY = 'near-expiry',
  EXPIRED = 'expired',
}

export enum Currencies {
  USD = 'usd',
  BRL = 'brl',
  ARS = 'ars',
}

export enum UserInteractionTypes {
  OTHER = 'other',
  APPOINTMENT_SCHEDULING = 'appointment-scheduling',
  SURVEY_AND_FEEDBACK_COLLECTION = 'survey-and-feedback-collection',
  OUTBOUND_REQUEST = 'outbound-request',
  INBOUND_REQUEST = 'inbound-request',
  SYSTEM = 'system',
  SUPPORT = 'support',
}

export enum ChannelTypes {
  MEET = 'meet',
  SOCIAL_MEDIA = 'social-media',
  EMAIL = 'email',
  CHAT = 'chat',
}

export enum ApplicantUrgencyLeves {
  EXTREMELY_URGENT = 'extremely-urgent',
  NORMAL = 'normal',
  URGENT = 'urgent',
}

export enum RejectionCausesTypes {
  APPLICANT_DUPLICATION = 'applicant-duplication',
  APPLICANT_NO_INTERESTED = 'applicant-no-interested',
  ENLITE_NO_INTERESTED = 'enlite-no-interested',
  QUOTATION_REJECTED = 'quotation-rejected',
}

export enum ApplicantHealthInsuranceLists {
  OTHER = 'other',
  UP = 'up',
  OUM = 'oum',
  SWISS_MEDICAL = 'swiss-medical',
  PODER_JUDICIAL = 'poder-judicial',
  PAMI = 'pami',
  OSUTHGRA = 'osuthgra',
  OSPPRA = 'osppra',
  OSPECOM = 'ospecom',
  OSMECOM = 'osmecom',
  OSLERA_UP = 'oslera-UP',
  OSIM = 'osim',
  OSDE = 'osde',
  OMINT = 'omint',
  MHM = 'mhm',
  NEDICUS = 'nedicus',
  IOMA = 'ioma',
  HOSPITAL_ITALIANO = 'hospital-italiano',
  GUINCHEROS = 'guincheros',
  GALENO = 'galeno',
  DAS = 'das',
  CASA = 'casa',
  BANCARIOS = 'bancarios',
  ACCORDSALUD = 'accordSalud',
}

export enum OptionStateRelatedTest {
  DELETED = 'deleted',
}

export enum SexTypes {
  MAN = 'man',
  WOMAN = 'woman',
}

export enum TherapistTypes {
  AT = 'at',
  CARER = 'carer',
}

export enum TaxConditionTypes {
  IVA_21 = 'iva_21',
  IVA_10_5 = 'iva_10_5',
  TAX_FREE = 'tax_free',
}

export enum BusinessTypes {
  PRIVATE_INSURANCE = 'private-insurance',
  PREPAID_INSURANCE = 'prepaid-insurance',
  INSURANCE = 'insurance',
}

export enum QuotationStatusTypes {
  APPROVED = 'approved',
  PENDING_APPROVAL = 'pending-approval',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export enum ApplicantDispositives {
  DOMICILIARY = 'domiciliary',
  INTERNMENT = 'internment',
  SCHOOL = 'school',
}

export enum PaymentModes {
  REFUND = 'refund',
  DIRECTLY_PAY = 'directly-pay',
}

export enum ApplicantSimpleOptions {
  NAO = 'nao',
  SIM = 'sim',
  NO = 'no',
  SI = 'si',
}

export enum RelativeTypes {
  OTHER = 'other',
  PARTNER = 'partner',
  CHILD = 'child',
  SISTER_BROTHER = 'sister-brother',
  FATHER = 'father',
  MOTHER = 'mother',
}

export enum GenderTypes {
  OTHER = 'other',
  WOMAN = 'woman',
  MAN = 'man',
}

export enum PersonIdentificationTypes {
  CPF = 'cpf',
  DNI = 'dni',
}

export enum TerapeutSpecialityTypes {}

export enum ApplicantsProfessionalDocType {}

export enum ApplicantsStateTypes {
  QUOTATION_REJECTED = 'quotation-rejected',
  QUOTATION_APPROVED = 'quotation-approved',
  INTERVIEW_SCHEDULED = 'interview-scheduled',
  CONVERTED = 'converted',
  PENDING_QUOTATION = 'pending-quotation',
  PENDING_INTERVIEW = 'pending-interview',
  REJECTED = 'rejected',
}

export interface IWorkerPsicologicalProfile extends IEntity {
  evaluationStatus: WorkerPsicologicalProfileStatus;
  psicologicalProfileDate: Date;
  observations?: string;
  evaluatorId: string;
  workerId: string;
}

export interface IWorkerEvaluationScore extends IEntity {
  workerEvaluationScoreDate: Date;
  questionScore: number;
  questionType: string;
  questionTypeId: string;
  workerId: string;
  workerEvaluationId: string;
}

export interface IWorkerEvaluation extends IEntity {
  evaluationState: WorkerEvaluationStates;
  evaluationDate: Date;
  evaluatorRole?: string;
  evaluatorId: string;
  userId: string;
}

export interface IQuestionsType extends IEntity {
  description: string;
  name: string;
}

export interface IPatientSupervision extends IEntity {
  supervisionDate: Date;
  clinicId: string;
  supervisionState: PatientSupervisionStates;
  supervision: string;
  userId: string;
}

export interface IPatientGoalsScore extends IEntity {
  goalTypeId: string;
  eventDate: Date;
  goalNotes: string;
  goalScore: number;
  patientTPGoalId: string;
  patientId: string;
  dailyReportId: string;
}

export interface IPatientsSchedulesException extends IEntity {
  relatedPatientScheduleId?: string;
  patientsSchedulesExceptionType: PatientsSchedulesExceptionTypes;
  reasignedWorkerId: string;
  end: Date;
  start: Date;
  dayOfWeek: number;
  userAddressId?: string;
  workerId?: string;
  userId: string;
}

export interface IDailyReport extends IEntity {
  checkOutLongitude?: number;
  checkOutLatitude?: number;
  patientScheduleId?: string;
  workerId?: string;
  dailyReportStatus: DailyReportStatusTypes;
  globalScore?: number;
  checkInLongitude?: number;
  checkInLatitude?: number;
  generalNotes?: string;
  checkOut?: Date;
  checkIn?: Date;
  eventDate: Date;
  userId: string;
}

export interface IPatientTPGoal extends IEntity {
  patientId?: string;
  goalTypeId: string;
  patientTherapeuticProjectId: string;
}

export interface IGoalType extends IEntity {
  type: string;
  name: string;
}

export interface IPatientsSchedule extends IEntity {
  endHour: Date;
  startHour: Date;
  dayOfWeek: number;
  userAddressId?: string;
  workerId?: string;
  userId: string;
}

export interface IPatientTherapeuticProject extends IEntity {
  therapeuticProjectState: TherapeuticProjectStates;
  symptoms: SymptomTypes[];
  observations: string;
  activityPlan: string;
  mainGoal: string;
  actualProject: string;
  clinicalContext: string;
  hypothesis: string;
  problem: string;
  userId: string;
}

export interface IOpenPositionWorker extends IEntity {
  notes?: string;
  order?: number;
  assignmentStatus: OpenPositionAsignmentStatusTypes;
  userId: string;
  openPositionId: string;
}

export interface IOpenPosition extends IEntity {
  workerTypes: TherapistTypes;
  workerAmount: number;
  workerProfile: string;
  workerSex: SexTypes;
  workerAttributes?: WorkerAttributes[];
  patient?: string;
  daySchedule?: string;
  agePreference?: WorkerAgePreferences[];
  pathologyType?: PathologiesTypes[];
  statusType: OpenPositionStatusTypes;
  paymentDate?: number;
  budget?: number;
  jobZone: string;
  jobAddress?: IAddress;
  jobDescription: string;
  relatedCampaign?: string;
  name: string;
}

export interface ICampaign extends IEntity {
  code: string;
  meta?: string;
  utm_content?: string;
  utm_term?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
  name: string;
}

export interface IPatientPaymentCondition extends IEntity {
  paymentDocReq?: string;
  paymentConditionsState?: PaymentConditionStateTypes;
  validUntil?: Date;
  validFrom?: Date;
  taxCondition?: TaxConditionTypes;
  monthlyHours?: number;
  paymentDate?: number;
  hourlyRateWorker?: number;
  collectionPeriod?: number;
  hourlyRateEnlite?: number;
  currency?: Currencies;
  healthInsuranceAgreementId?: string;
  paymentMode: PaymentModes;
  healthInsuranceId?: string;
  businessType?: BusinessTypes;
  userId: string;
}

export interface IPatientHealthInsurance extends IEntity {
  affiliateNumber?: string;
  companyId: string;
  userId: string;
}

export interface IPatientRelative extends IEntity {
  relationshipType: RelativeTypes;
  relativeId: string;
  patientId: string;
}

export interface IRelative extends IUserBasicData {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  identificationType?: string;
  identificationNumber?: string;
  dirtyAddress?: IAddress;
}

export interface IFruit extends IEntity {
  asdadsds?: string;
  multiSelectFieldAsync?: string[];
  multiSelectFieldPreloaded?: PersonNationalities[];
  releaseDate?: string;
  profileImage?: IAttachment;
  profileImage_isPublic?: boolean;
  creditCard?: string;
  telefonoPrueba?: string;
  sexType: SexTypes;
  description: string;
  name: string;
}

export interface IUserInteraction extends IEntity {
  attendantUserId?: string;
  interactionType: UserInteractionTypes;
  channel: ChannelTypes;
  notes: string;
  interactionDate: Date;
  userId: string;
}

export interface ICompanyEmployee extends IUserBasicData {
  companyEmployeeRole: CompanyEmployeeRoleTypes;
  userId?: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  identificationType?: string;
  identificationNumber?: string;
  dirtyAddress?: IAddress;
}

export interface ICompany extends IEntity {
  countryCode?: string;
  address?: string;
  identificationType?: PersonIdentificationTypes;
  identificationNumber?: string;
  taxCondition?: TaxConditionTypes;
  monthlyReport: boolean;
  contactPhone: string;
  contactName: string;
  contactEmail: string;
  name: string;
}

export interface IHealthInsuranceAgreement extends IEntity {
  agreementState: HealthInsuranceAgreementsStateTypes;
  active?: boolean;
  taxCondition?: TaxConditionTypes;
  currency: Currencies;
  validUntil: Date;
  validFrom: Date;
  weeklyHoursMax?: string;
  hourlyRateEnlite: number;
  name: string;
  companyId: string;
}

export interface IApplicantQuotation extends IEntity {
  currency?: Currencies;
  validUntil: Date;
  validFrom: Date;
  monthlyHours: number;
  hourRateEnlite: number;
  paymentDate?: number;
  hourRateWorker: number;
  healthInsuranceAgreementId: string;
  healthInsuranceId: string;
  collectionPeriod: number;
  taxConditionType: TaxConditionTypes;
  paymentModeType: PaymentModes;
  businessType: BusinessTypes;
  applicantQuotationStatusType: QuotationStatusTypes;
  applicantId: string;
}

export interface IPatientWorker extends IEntity {
  workerId: string;
  patientId: string;
}

export interface IWorker extends IUserBasicData {
  workerAttributes?: WorkerAttributes[];
  registerUrlLink?: string;
  availabilityWeek?: any;
  sex: SexTypes;
  workerState?: WorkerStateTypes;
  certificates?: string;
  criminalRecord?: IAttachment;
  criminalRecord_isPublic?: boolean;
  civilLiabilityInsurancePolicy?: IAttachment;
  civilLiabilityInsurancePolicy_isPublic?: boolean;
  taxInscription?: IAttachment;
  taxInscription_isPublic?: boolean;
  identification?: IAttachment;
  identification_isPublic?: boolean;
  curriculum?: IAttachment;
  curriculum_isPublic?: boolean;
  agePreference?: WorkerAgePreferences[];
  pathologiesPreference?: PathologiesTypes[];
  maxDistance?: number;
  shiftsAvailable?: WorkerShiftsAvailableOptions[];
  daysAvailable?: WorkerDaysAvailableOptions[];
  civilStatus?: PersonCivilStatusTypes;
  nationality?: PersonNationalities;
  birthDate?: Date;
  yearsExperience?: WorkerYearsExperienceOptions;
  educationalLevel?: WorkerEducationalLevels;
  pathologiesExperience?: PathologiesTypes[];
  gender?: GenderTypes;
  profession: WorkerProfessionTypes;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  identificationType?: string;
  identificationNumber?: string;
  dirtyAddress?: IAddress;
}

export interface IUsersAddress extends IEntity {
  isPrimary?: boolean;
  address: IAddress;
  userId: string;
}

export interface IPatient extends IUserBasicData {
  pathologiesTypes?: PathologiesTypes;
  patientAgeRange?: WorkerAgePreferences;
  affiliateNumber?: string;
  relativeObservations?: string;
  relativePhoneNumber?: string;
  relativePostalCode?: string;
  relationshipType?: RelativeTypes;
  relativeIdentificationNumber?: string;
  relativeName?: string;
  sex?: SexTypes;
  civilStatus?: PersonCivilStatusTypes;
  clinicStateType?: PatientsClinicStateTypes;
  postalCode?: string;
  fatherName?: string;
  motherName?: string;
  identificationNumberCPF?: string;
  enliteService: EnliteServices;
  treatmentProfName?: string;
  treatmentProfPhone?: string;
  patientReport?: string;
  suicideAttempt?: boolean;
  manageMoney?: boolean;
  aggresiveBehaviour?: boolean;
  previousTreatment?: boolean;
  urgencyLevelComments?: string;
  urgencyLevel?: ApplicantUrgencyLeves;
  diagnosisDetails?: string;
  diagnostic?: string;
  therapistWeeklyHours?: string;
  therapistMonthlyHours?: string;
  therapistSchedule?: string;
  therapistDays?: string;
  therapistProfile?: string;
  therapistSex?: SexTypes;
  therapistAmount?: number;
  therapistGender?: GenderTypes;
  therapistType?: TherapistTypes;
  schoolName?: string;
  serviceType?: string;
  schoolContact?: string;
  disabilityCertificate?: boolean;
  writOfProtection?: boolean;
  gender?: GenderTypes;
  birtdate?: Date;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  identificationType?: string;
  identificationNumber?: string;
  dirtyAddress?: IAddress;
}

export interface IApplicant extends IEntity {
  pathologiesTypes?: PathologiesTypes;
  applicantsAgeRange?: WorkerAgePreferences;
  rejectionCause?: RejectionCausesTypes;
  patientStory?: string;
  therapistMonthlyHours?: string;
  therapistWeeklyHours?: string;
  therapistSchedule?: string;
  therapistDays?: string;
  therapistProfile?: string;
  therapistSex?: SexTypes;
  therapistGender?: GenderTypes;
  therapistAmount?: number;
  therapistType?: TherapistTypes;
  serviceDispositive?: ApplicantDispositives;
  cashManagement?: ApplicantSimpleOptions;
  aggressiveBehavior?: boolean;
  suicidalThoughts?: boolean;
  wasAssistedBefore?: boolean;
  urgencyLevel?: ApplicantUrgencyLeves;
  relativeEmail?: string;
  relativeIdentificationType?: PersonIdentificationTypes;
  applicantIdentificationType: PersonIdentificationTypes;
  applicantGender: GenderTypes;
  cudCertificate: boolean;
  insuranceNumber?: string;
  applicantStateType: ApplicantsStateTypes;
  comments?: string;
  tentativeSchedule?: string;
  applicantAddress: IAddress;
  ivaCondition: string;
  amparoIndicator?: ApplicantSimpleOptions;
  paymentMode?: PaymentModes;
  paymentDocsEnlite?: string;
  insurance: ApplicantHealthInsuranceLists;
  paymentMethod: BusinessTypes;
  schoolDocsfromEnlite?: string;
  schoolDocs?: string;
  schoolName?: string;
  schoolContact?: string;
  schoolAccompaniment: boolean;
  professionalStaffPhoneNumber?: string;
  professionalStaffFullname?: string;
  specialNeeds?: string;
  diagnostic: string;
  relativePhoneNumber?: string;
  relativeIdentificationNumber?: string;
  applicantBirthdate: Date;
  relativeFullname?: string;
  applicantIdentificationNumber: string;
  applicantPhoneNumber: string;
  relationWithApplicant?: RelativeTypes;
  applicantEmail: string;
  applicantFullname: string;
}

export interface IPathology extends IEntity {
  type: string;
  description?: string;
  name: string;
}
