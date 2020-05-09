import { Router } from 'express';

const methodNotAllowed = (req, res, methods) => {
  res.set('Allow', methods.join(', ').toUpperCase());
  res.status(405).end();
};

const anyButUse = (method) => method !== 'use';

const getAllowedMethods = (handlers) => {
  return Object.keys(handlers).filter(anyButUse);
};

export const initializeRouter = (routes) => {
  const router = Router();

  routes.forEach(([path, handlers]) => {
    // Remove express's use method from allowed header methods list
    const allowedMethods = getAllowedMethods(handlers);

    // Set handlers for specified HTTP methods
    Object.entries(handlers).forEach(async ([method, handler]) => {
      if (Array.isArray(handler)) {
        await router[method](path, ...handler);
      } else {
        await router[method](path, handler);
      }
      // Send 405 if method was not specified
      await router.all(path, (req, res) => methodNotAllowed(req, res, allowedMethods));
    });
  });

  return router;
};
