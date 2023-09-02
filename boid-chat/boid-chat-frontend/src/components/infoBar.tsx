import React from "react";
import { IRoomData } from "../interfaces/types";
import onlineIcon from "../icons/greencircle.png";
import closeIcon from "../icons/close.png";
import userIcon from "../icons/userIcon.png";

interface InfoBarProps {
  roomData: IRoomData;
}

// Top bar on the chat box
const InfoBar: React.FC<InfoBarProps> = ({ roomData: { room, users } }) => {
  const numberOfUsers = users.length;
  return (
    <div className="flex rounded-t-lg bg-transparent h-8 border justify-between">
      <div className="bg-transparent right-0 rounded-lg flex items-center  px-2">
        <img className="w-2 h-2 right-0" src={onlineIcon} alt="online icon" />
        <h3 className="px-5">{room}</h3>
      </div>
      <div className="bg-transparent flex items-center">
        <img className="w-5 h-5 " src={userIcon} alt="users icon" />
        <h3 className="bg-transparent px-3">{numberOfUsers}</h3>
      </div>
      <div className="bg-transparent w-1/2 rounded-lg px-3 relative ">
        <a href="/">
          <img
            className="w-4 h-4 right-2 top-[6px] absolute"
            src={closeIcon}
            alt="close icon"
          />
        </a>
      </div>
    </div>
  );
};

export default InfoBar;
