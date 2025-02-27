const { HttpError, ctrlWrapper } = require('../helpers');
const {Contact} = require("../models/contact");

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
  const result = await Contact.findOne({ _id: contactId, owner: _id });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
   res.json(result);
};

const add = async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({_id: contactId, owner}, {...req.body}, {new: true});
  if (!result) {
    throw HttpError(404, 'Not found');
  }
   res.status(200).json(result);
};


const updateFavorite = async (req, res) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({_id: contactId, owner}, {...req.body}, {new: true});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndRemove({ _id: contactId, owner: _id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Delete success" });
};


module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateFavorite: ctrlWrapper(updateFavorite),
};








