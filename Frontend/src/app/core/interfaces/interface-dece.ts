export interface InterfaceDece {
  id?: ID;
  CI: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  nameInstitution: string;
  password?: string;
  role?: string;
  status?: string;
}

interface ID {
  $oid: string;
}
