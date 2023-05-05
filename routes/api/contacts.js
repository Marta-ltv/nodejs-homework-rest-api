const express = require('express');

const router = express.Router();

const { validateBody } = require('../../middlewares');

const {schemas} = require('../../schemas/contacts');

const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateStatus,
} = require('../../controllers/contacts');

router.get('/', getAll);

router.get('/:contactId', getById);

router.post('/', validateBody(schemas.postSchema), add);

router.delete('/:contactId', deleteById);

router.put('/:contactId', validateBody(schemas.putSchema), updateById);

router.patch(
  '/:contactId/favorite',
  validateBody(schemas.patchSchema),
  updateStatus
);

module.exports = router;