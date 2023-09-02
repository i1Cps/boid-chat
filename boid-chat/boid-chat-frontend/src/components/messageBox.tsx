import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./message";
import { IMessage } from "../interfaces/types";

interface MessageBoxProps {
  name: string;
  messages: IMessage[];
}

// Displays all the messages sent to the room with the use of a react scroll component
// Has dynamic div's to display each message recieved
const MessageBox: React.FC<MessageBoxProps> = ({ messages, name }) => (
  <ScrollToBottom className="basis-96 overflow-auto  scroll-bar-hide flex border-x">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
  </ScrollToBottom>
);

export default MessageBox;
