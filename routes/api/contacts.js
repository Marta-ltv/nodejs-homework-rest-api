const express = require('express');

const router = express.Router();

const { validateBody } = require('../../middlewares');

const {
  postSchema,
  putSchema,
  patchSchema,
} = require('../../schemas/contacts');

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

router.post('/', validateBody(postSchema), add);

router.delete('/:contactId', deleteById);

router.put('/:contactId', validateBody(putSchema), updateById);

router.patch(
  '/:contactId/favorite',
  validateBody(patchSchema),
  updateStatus
);

module.exports = router;