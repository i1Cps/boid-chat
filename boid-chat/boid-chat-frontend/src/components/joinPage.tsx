import { useState } from "react";
import { Link } from "react-router-dom";

function JoinPage() {
  // State variable hooks
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // Renders join page
  return (
    <div
      className="w-screen h-screen bg-center bg-cover
        bg-clouds brightness:-105 hover:brightness-105 grid grid-rows-2 justify-center items-center"
    >
      <div className=" grid grid-cols-2   rounded p-4">
        <div className="p-2  w-64 h-36 flex justify-center items-center ">
          <h1 className="text-4xl text-center font-extralight  text-blue-700">
            BoidChat
          </h1>
        </div>
        <div className=" grid gap-1 p-2 w-64 h-40 space-y-1">
          <div className=" p-1 border border-white rounded-sm text-white">
            <input
              placeholder="username"
              className="w-full h-full bg-transparent placeholder:text-white
                            focus:outline-none"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className=" p-1 border border-white rounded-sm">
            <input
              placeholder="Main Room"
              className="w-full h-full bg-transparent placeholder:text-white
                            focus:outline-none"
              type="text"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <div className="bg-white border border-white rounded-sm">
            <Link
              onClick={(e) => (!name || !room ? e.preventDefault() : null)}
              to={`/main?name=${name}&room=${room}`}
            >
              <button className="w-full h-full text-blue-500" type="submit">
                Join world
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinPage;
