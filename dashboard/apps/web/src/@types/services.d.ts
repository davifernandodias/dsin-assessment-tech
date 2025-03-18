

export interface GetAllServicesFetch {
  services: Service[]; 
  totalCount: number; 
  success: boolean; 
  message: string; 
}


export interface Service {
  id: string;
  typeId: string;
  description: string;
  price: string;
  durationMinutes: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
  clientName: string;
  clientPhone: string | null;
}

interface ClientData {
  appointments: Appointment[];
  services: Service[];
}