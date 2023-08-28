export interface EvaluatorRole {
  id?: string;
  CI: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password?: string;
  nameInstitution: string;
  role?:string;
  status?:boolean;
}
