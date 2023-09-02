export interface IUser {
  name: string;
  room: string;
}

export interface IRoomData {
  room: string;
  users: IUser[];
}

export interface IMessage {
  user: string;
  text: string;
}
