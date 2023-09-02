import React from "react";
import InfoBar from "./infoBar";
import MessageBox from "./messageBox";
import InputBox from "./inputBox";
import { IRoomData, IMessage } from "../interfaces/types";

// Interface to type all the props
interface ChatBoxProps {
  name: string;
  message: IMessage;
  messages: IMessage[];
  roomData: IRoomData;
  setMessage: React.Dispatch<React.SetStateAction<IMessage>>;
  sendMessage: (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => void;
}

// .. Main chat application component
const ChatBox: React.FC<ChatBoxProps> = ({
  name,
  message,
  messages,
  roomData,
  setMessage,
  sendMessage,
}) => (
  <div className="bg-transparent w-[30rem] h-96 smooth-scroll flex flex-col grow-0 ">
    <InfoBar roomData={roomData} />
    <MessageBox messages={messages} name={name} />
    <InputBox
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
    />
  </div>
);

export default ChatBox;
