export interface InterfaceTestEstudiante {
    _id?: ID;
    name: string;
    url: string;
    value: number;
    section: string;
}

interface ID {
    $oid: string;
}
