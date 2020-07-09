export interface IMessageDetail {
  message: string;
  created_time: string;
  from: {
    name: string;
    email: string;
    id: string;
  };
  id: string;
  to: {
    data: [{
      name: string;
      email: string;
      id: string;
    }];
  };
}

export interface IConversation {
  data: IMessageDetail[];
}
