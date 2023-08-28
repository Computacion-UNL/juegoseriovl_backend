export interface InterfaceTestQuestion {
  _id: string;
  nameQuestion: string;
  descriptionQuestion: string;
  answer: Answer[];
}

export interface Answer {
  nameAnswer: string;
  valueAnswer: number;
  _id: string;
}
