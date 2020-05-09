import authRoutes from '../api/auth';
import gameRoutes from '../api/game';
import { initializeRouter } from '../utils/routes-helpers';

const routes = {
  route: '/',
  router: initializeRouter([
    [
      '/auth',
      {
        use: authRoutes.router
      }
    ],
    [
      '/game',
      {
        use: gameRoutes.router
      }
    ]
  ])
};

export default routes;
