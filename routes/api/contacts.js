const express = require('express');

const router = express.Router();

const { validateBody, authenticate } = require('../../middlewares');

const {schemas} = require('../../models/contact');

const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateFavorite,
} = require('../../controllers/contacts');

router.get('/', authenticate, getAll);

router.get('/:contactId', authenticate, getById);

router.post('/', authenticate, validateBody(schemas.addSchema), add);

router.delete('/:contactId',authenticate, deleteById);

router.put('/:contactId',authenticate, validateBody(schemas.addSchema), updateById);

router.patch(
  '/:contactId/favorite',
  authenticate,
  validateBody(schemas.updateFavoriteSchemas),
  updateFavorite
);

module.exports = router;