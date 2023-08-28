export interface InterfaceQuestion {
    _id?: ID;
    nameQuestion: string;
    descriptionQuestion: string;
    answer: Answer[];
}

interface ID {
    $oid: string;
}

interface Answer {
    nameAnswer: string;
    valueAnswer: number;
}

