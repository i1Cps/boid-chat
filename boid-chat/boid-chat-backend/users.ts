interface User {
  id: string;
  name: string;
  room: string;
}

const users: User[] = [];

// Adds a user to users list checking first if user.name exists, if it does
// throw an error
const addUser = ({ id, name, room }: User): { error?: string; user?: User } => {
  if (name) {
    // theo bLUe rOom => theoblueroom
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
  } else {
    return { error: "Username is undefined" };
  }

  const existingUser = users.find(
    (user) => user.room === room && user.name === name,
  );

  if (existingUser) {
    return { error: "Username is currently taken" };
  }

  const user: User = { id, name, room };
  users.push(user);
  return { user };
};

// Searches array of user objects for a matching id, if found it removes the user from list
const removeUser = (id: string): User | undefined => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Searches for a user by ID
const getUser = (id: string): User | undefined =>
  users.find((user) => user.id === id);
const getUsersInRoom = (room: string): User[] =>
  users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
