import React from "react";
import "../index.css";
import { IMessage } from "../interfaces/types";

interface MessageProps {
  name: string;
  message: IMessage;
}

// Renders users messages in chat box
const SenderMessage: React.FC<{
  trimmedName: string;
  text: string | undefined;
}> = ({ trimmedName, text }) => (
  <div className="bg-transparent flex flex-row h-12 justify-end m-2">
    <p className="violet-gradient w-20 flex m-2 border rounded-lg justify-center items-center">
      {trimmedName}
    </p>
    <div className="bg-transparent h-full min-w-[20%] px-2 border rounded-lg flex justify-center items-center">
      <p className="">{text}</p>
    </div>
  </div>
);

// Renders other users messages in the chat box
const OtherMessage: React.FC<IMessage> = ({ user, text }) => (
  <div className="bg-transparent flex flex-row h-12 m-2">
    <div className="bg-transparent h-full min-w-[20%] px-2 border rounded-lg flex justify-center items-center">
      <p className="">{text}</p>
    </div>
    <p className="aqua-gradient w-20 flex m-2 border rounded-lg justify-center items-center">
      {user}
    </p>
  </div>
);

// Renders messages in the chat box
const Message: React.FC<MessageProps> = ({ message: { user, text }, name }) => {
  const trimmedName = name.trim().toLowerCase();
  const isSentbyCurrentUser = user === trimmedName;

  return (
    <div>
      {isSentbyCurrentUser ? (
        <SenderMessage trimmedName={trimmedName} text={text} />
      ) : (
        <OtherMessage user={user} text={text} />
      )}
    </div>
  );
};
export default Message;
