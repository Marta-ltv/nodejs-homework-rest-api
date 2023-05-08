const { HttpError, ctrlWrapper } = require('../helpers');
const Contact  = require("../models/contact")

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner },"-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
  res.json(result);
};

const getById = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, owner: _id });
  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: { result: contact },
  });
};

const add = async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });
 return result;
};

const updateById = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, 'missing fields');
  }
  const result = await Contact.findOne({ _id: contactId, owner: _id });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
   await Contact.updateOne({ _id: contactId, owner: _id }, { $set: req.body });
   res.json(result);
};

const deleteById = async (req, res) => {
   const { _id } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove({ _id: contactId, owner: _id });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({ message: "Delete success" });
};

const updateFavorite = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, 'missing fields favorite');
  }
  const result = await Contact.findOne({ _id: contactId, owner: _id });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  await Contact.updateOne({ _id: contactId, owner: _id }, { $set: req.body });
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateFavorite: ctrlWrapper(updateFavorite),
};








