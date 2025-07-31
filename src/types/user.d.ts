
export interface WorkJourney {
  description: string;
  expectedWorkload: string;
}

export interface Employee {
  id: number;
  name: string;
  cpf: string;
  email: string;
  role: 'ROLE_MANAGER' | 'ROLE_EMPLOYEE';
  workJourneyInfoDTO: WorkJourney;
}

export interface PaginatedUsersResponse {
  content: Employee[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}


export type TimeEntry = string;


export interface TimeSummary {
  hours: number;
  minutes: number;
  asString: string;
}

export interface DailySummaryData {
  totalWork: TimeSummary;
  totalBreak: TimeSummary;
  balance: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | string;
}


export interface DailySummary {
  date: string;
  workJourney: WorkJourney;
  timeEntries: TimeEntry[];
  summary: DailySummaryData;
}


export interface EmployeeDetailsResponse {
  user: Employee;
  summary: DailySummary;
}



export interface CreateUserPayload {
  name: string;
  cpf: string;
  email: string;
  password?: string;
  role: 'ROLE_EMPLOYEE' | 'ROLE_MANAGER';
  workJourneyId: number;
}