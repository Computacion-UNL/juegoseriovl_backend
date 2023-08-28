export interface InterfacePersona {
  _id?: ID;
  CI: string;
  name: string;
  lastName: string;
  age?: number;
  address: string;
  phone: string;
  email: string;
  institution: string;
  rol: string;
}

interface ID {
  $oid: string;
}
