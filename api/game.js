import { initializeRouter } from '../utils/routes-helpers';
import { sqlQuery } from '../postgres';

export const getTopPlayers = async (req, res) => {
  try {
    const topPlayers = await getTopUsers();
    res.status(200).json(topPlayers);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserScore = async (req, res) => {
  try {
    await updateScoreInDatabase(req.body.scoreId, req.body.total, req.body.ammo, req.body.level);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const routes = {
  route: '/',
  router: initializeRouter([
    [
      '/top',
      {
        patch: getTopPlayers
      }
    ],
    [
      '/score',
      {
        patch: updateUserScore
      }
    ]
  ])
};

export default routes;

const updateScoreInDatabase = async (scoreId, newTotal, ammo, newLevel) => {
  let score = [];

  if (scoreId) {
    score = await sqlQuery(`
    SELECT
    score.total,
    score.targets_hit,
    score.level
    FROM 
      score
    WHERE score.id = ${scoreId}`);
  }

  if (score[0]) {
    const { total, targets_hit, level } = score[0];

    await sqlQuery(`
    UPDATE
    score SET (total, targets_hit, level) = (${+total > +newTotal ? +total : +newTotal}, ${+targets_hit + +ammo}, ${+newLevel > +level ? +newLevel : +level}) WHERE id = ${scoreId}`);
  }
};

const getTopUsers = async () => {
  const users = await sqlQuery(`
    SELECT
    users_2.name,
    score.total,
    score.targets_hit,
    score.level
    FROM 
      users_2
    LEFT JOIN 
      score
    ON 
      users_2.score = score.id
    GROUP BY 
      score.total,
      score.targets_hit,
      score.level,
      users_2.id
    ORDER BY 
      score.total 
    DESC
    LIMIT 10`);
  return users;
};
