import React from "react";
import { IMessage } from "../interfaces/types";

interface InfoBoxProps {
  message: IMessage;
  setMessage: React.Dispatch<React.SetStateAction<IMessage>>;
  sendMessage: (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => void;
}

// Input box on the chat box with text field and send button
const InfoBox: React.FC<InfoBoxProps> = ({
  message,
  setMessage,
  sendMessage,
}) => {
  return (
    <div className="bg-transparent shrink-0 h-12 relative border">
      <form className="flex order-y inset-x-0 bottom-0 absolute h-full">
        <input
          className="items-center bg-transparent w-full  h-full focus:outline-none mx-2 "
          type="text"
          placeholder="Type a message..."
          value={message.text}
          onChange={(e) =>
            setMessage({ user: message?.user, text: e.target.value })
          }
          //onChange={setMessage({ user: message.user, text: e.target.value })}
          onKeyDown={(e) => (e.key === "enter" ? sendMessage(e) : null)}
        />
        <button
          className="bg-white w-full basis-32 right-0 text-blue-500"
          onClick={(e) => sendMessage(e)}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default InfoBox;
