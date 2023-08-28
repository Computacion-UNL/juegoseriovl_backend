export interface InterfaceTeacher {
    _id: string;
    person: string;
    user: User;
    institution: Institution;
    status: string;
}

interface Institution {
    nameInstitution: string;
}

interface User {
    person: Person;
    role: string;
    status: boolean;
}

interface Person {
    name: string;
    lastName: string;
    email: string;
    CI: string;
}