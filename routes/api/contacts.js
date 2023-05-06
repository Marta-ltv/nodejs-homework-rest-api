const express = require('express');

const router = express.Router();

const { validateBody, authenticate } = require('../../middlewares');

const {schemas} = require('../../schemas/contacts');

const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateStatus,
} = require('../../controllers/contacts');

router.get('/', authenticate, getAll);

router.get('/:contactId', authenticate, getById);

router.post('/', authenticate, validateBody(schemas.postSchema), add);

router.delete('/:contactId',authenticate, deleteById);

router.put('/:contactId',authenticate, validateBody(schemas.putSchema), updateById);

router.patch(
  '/:contactId/favorite',
  authenticate,
  validateBody(schemas.patchSchema),
  updateStatus
);

module.exports = router;