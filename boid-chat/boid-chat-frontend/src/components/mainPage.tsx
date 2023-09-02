import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import ChatBox from "./chatBox";
import BoidsComponent from "./boids/boids";
import { IRoomData, IUser, IMessage } from "../interfaces/types";
import "../index.css";

import io from "socket.io-client";
//const ENDPOINT = "https://boid-chat-backend.com";
const ENDPOINT = "httplocalhost:5000"
let socket = io(ENDPOINT, {});

function MainPage() {
  // React hooks
  const [userConnected, setUserConnected] = useState(false);

  const location = useLocation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState<IMessage>({ user: "", text: "" });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [roomData, setRoomData] = useState<IRoomData>({ users: [], room: "" });
  const navigate = useNavigate();

  // When a user chooses a name and a room from the join page
  useEffect(() => {
    // Construct user object using name and room in url
    const { name, room } = queryString.parse(location.search);
    const user: IUser = {
      name: name as string,
      room: room as string,
    };

    // Stores the name client side as state variables
    setName(user.name);

    // 'join' event is emitted to the server
    socket.emit(
      "join",
      { name: user.name, room: user.room },
      (error: string) => {
        if (error) {
          alert(error);
          console.log("Another user has that name");
          navigate("/");
        }
        // Call back function sets the 'userConnected' useState of
        // the client to true
        setUserConnected(true);
      },
    );

    // useEffect hook is called again if the url changes (I.E. name or room) or the ENDPOINt changes
  }, [navigate, location.search]);

  // When the user recieves an update on room data from the server
  useEffect(() => {
    const handleRoomData = (newRoomData: IRoomData) => {
      setRoomData(newRoomData);
    };
    // When client recives 'RoomData' event from server, update roomdata state variable
    socket.on("RoomData", handleRoomData);
    // remove event listener when component is unmounted
    return () => {
      socket.off("RoomData");
    };
  }, []);

  // When the user recieves a message from the server
  useEffect(() => {
    socket.on("message", (message: { user: string; text: string }) => {
      // Adds the recieved message to the end of the 'messages' array
      setMessages([...messages, message]);
    });
    // The hook is called again if the messages array is updated
  }, [messages]);

  // Function that is called when user hits 'enter' or 'send' in chat room
  const sendMessage = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Stops default behaviour (refreshing page) when hitting enter/send (submitting a form)
    e.preventDefault();
    // Emits a 'message' event to the server
    if (message) {
      // setMessage call back function is called with empty string
      // to reset the message state to empty
      socket.emit("sendMessage", message, () =>
        setMessage({ user: "", text: "" }),
      );
    }
  };

  // While client is waiting for to be connected to the server
  // This page is displayed
  if (!userConnected) {
    return (
      <div
        className="relative h-screen flex justify-center items-center"
        title="0"
      >
        <div className="w-1/2 h-1/2 flex justify-center items-center">
          <svg
            className="w-full h-full"
            version="1.1"
            id="loader-1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
            enableBackground="new 0 0 40 40"
            xmlSpace="preserve"
          >
            <path
              opacity="0.2"
              fill="#000"
              d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
            />
            <path
              fill="#000"
              d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                            C22.32,8.481,24.301,9.057,26.013,10.047z"
            >
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>
    );
  } else {
    // Client side components to handle chat box visuals
    return (
      <div
        className="p-5 w-screen h-screen bg-center bg-cover
            bg-clouds brighness:-105 hover:brightness-105  z-0"
      >
        <div className="absolute inset-0 z-10 bg-transparent">
          {/* Display the BoidsComponent as a background */}
          <BoidsComponent
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </div>
        <div className="relative z-20">
          <ChatBox
            name={name}
            roomData={roomData}
            message={message}
            messages={messages}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    );
  }
}

export default MainPage;
