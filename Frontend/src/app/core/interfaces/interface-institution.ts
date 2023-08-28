export interface InterfaceInstitution {
  _id?: ID;
  nameInstitution: string;
  addressInstitution: string;
  typeInstitution: string;
  stateInstitution: string;
  cityInstitution: string;
  phoneInstitution: string;
  emailInstitution: string;
}

interface ID {
  $oid: string;
}
