import { initializeRouter } from '../utils/routes-helpers';
import { sqlQuery } from '../postgres';
import { getTopPlayers } from './game';

const signIn = async (req, res) => {
  try {
    const user = await validateUser(req.body.name, req.body.password)
    if (user) {
      const token = '123' //generateToken(user);

      res.status(200).json({
        ...user,
        token
      });
    } else {
      res.status(401).json({ message: 'Email or password is incorrect' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await getUserByName(req.body.name)
    if (!user) {
      await createUserInDatabase(req.body.name, req.body.password)
      res.status(200).end();
    } else {
      res.status(400).json({ message: 'User with such name already exists' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const routes = {
  route: '/',
  router: initializeRouter([
    [
      '/sign-in',
      {
        post: signIn
      }
    ],
    [
      '/sign-up',
      {
        post: createUser
      }
    ]
  ])
};

export default routes;

const getUserByName = async (name) => {
  const users = await sqlQuery(`SELECT * FROM users_2 WHERE name = '${name}'`);
  return users[0];
};

const createUserInDatabase = async (name, password) => {
  await sqlQuery(`INSERT INTO users_2 (name, password) VALUES ('${name}', '${password}')`);
};

const validateUser = async (name, password) => {
  const user = await getUserByName(name);
  console.log(user)
  if (user && user.password === password) {
    return user;
  }
}
