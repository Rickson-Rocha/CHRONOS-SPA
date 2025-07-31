import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type { LoginCredentials, LoginResponse } from '../types/auth';
import type { DailySummary, PaginatedUsersResponse, EmployeeDetailsResponse, CreateUserPayload } from '../types/user';
import type { WorkJourneyOption } from '../types/workJourney';


interface BackendError {
  timestamp: number;
  status: number;
  error: string;
  path: string;
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

   
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });


    this.api.interceptors.response.use(
 
      (response) => response,
      
     
      (error: AxiosError<BackendError>) => {
      
        if (error.response && error.response.data && error.response.data.error) {
          const errorMessage = error.response.data.error;
          console.error(`Erro da API: ${errorMessage}`);
         
          return Promise.reject(new Error(errorMessage));
        }
 
        return Promise.reject(new Error('Ocorreu um erro de comunicação. Tente novamente.'));
      }
    );
  }


  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await this.api.post<LoginResponse>('/auth/login', credentials);
    return data;
  }


  async getUsers(): Promise<PaginatedUsersResponse> {
    const { data } = await this.api.get<PaginatedUsersResponse>('/users');
    return data;
  }

  async getEmployeeDetails(employeeId: number): Promise<EmployeeDetailsResponse> {
    const { data } = await this.api.get<EmployeeDetailsResponse>(`/users/employees/${employeeId}`);
    return data;
  }

  async createUser(payload: CreateUserPayload): Promise<any> {
    const { data } = await this.api.post('/users', payload);
    return data;
  }

  async getWorkJourneys(): Promise<WorkJourneyOption[]> {
    const { data } = await this.api.get<WorkJourneyOption[]>('/work-journeys');
    return data;
  }

  async getPointSummary(): Promise<DailySummary> {
    const { data } = await this.api.get<DailySummary>('/points/summary');
    return data;
  }

  async registerPoint(timestamp: string): Promise<any> {
    const { data } = await this.api.post('/points/register', { timestamp });
    return data;
  }

  async getPointSummaryByDate(date: string): Promise<DailySummary> {
    const { data } = await this.api.get<DailySummary>('/points/summary', {
      params: {
        date: date 
      }
    });
    return data;
  }
   async getEmployeeDetailsByDate(employeeId: number, date: string): Promise<EmployeeDetailsResponse> {
    const { data } = await this.api.get<EmployeeDetailsResponse>(`/users/employees/${employeeId}`, {
      params: {
        date: date
      }
    });
    return data;
  }
}


const apiService = new ApiService();
export default apiService;