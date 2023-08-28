export interface InterfaceCaso {
    _id: string;
    dateStart: Date;
    ciStudent: string;
    nameStudent: string;
    lastNameStudent: string;
    nameInstitutionStudent: string;
    ciTeacher: string;
    nameTeacher: string;
    lastNameTeacher: string;
    emailTeacher: string;
    ciDece: string;
    namDece: string;
    lastNameDece: string;
    emailDece: string;
    statusTestStudent: boolean;
    statusTestTeacher: boolean;
    parallel?: string;
    grade?: string;
}
