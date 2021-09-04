const users = [];

function get_user(userSub) {
  return users.find((user) => user.userSub === userSub);
}

function user_connect(user) {
  // console.log("user_connect => " + user.attributes.sub)
  const new_user = { "userSub": user.attributes.sub, "username": user.username };

  const index = users.findIndex((user) => user.userSub === new_user.userSub);

  if (index === -1) {
    users.push(new_user);
    return new_user;
  }
  // console.log("user_connect => User already exists, skipping..")
  return null
}

function user_disconnect(userSub) {
  // console.log("user_disconnect => " + userSub)
  const index = users.findIndex((user) => user.userSub === userSub);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  // console.log("user_disconnect => Invalid user, skipping..")
}

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function test() {
//   while (true) {
//     await sleep(1000)
//     console.log(users)
//   }
// }

module.exports = {
  get_user,
  user_connect,
  user_disconnect,
};

// test();
