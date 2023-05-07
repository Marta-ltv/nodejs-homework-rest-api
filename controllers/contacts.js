const { HttpError, ctrlWrapper } = require('../helpers');

const Contact  = require("../models/contact")


const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner }, {skip, limit}).populate("owner", "name email");
  res.status(200).json({
    status: 'success',
    code: 200,
    data: { result: contacts },
  });
};

const getById = async (req, res, next) => {
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

const add = async (req, res, next) => {
  // console.log('object');
  const { _id: owner } = req.user;
  const result = await Contact.create(...req.body, owner);
  res.status(201).json({
    status: 'success',
    code: 201,
    data: { result },
  });
};

const updateById = async (req, res, next) => {
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
  res.status(200).json({
    status: 'success',
    code: 201,
    data: { result },
  });
};

const deleteById = async (req, res, next) => {
   const { _id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.deleteOne({ _id: contactId, owner: _id });
  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'contact deleted',
    data: contact,
  });
};

const updateStatus = async (req, res, next) => {
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
  res.status(200).json({
    status: 'success',
    code: 201,
    data: { result },
  });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateStatus: ctrlWrapper(updateStatus),
};









// const Contact = require("../models/contact");

// const { v4 } = require('uuid');

// const { HttpError, ctrlWrapper } = require("../helpers");

// const getAll = async (req, res) => {
//   const result = await Contact.find();
//   res.json(result);
// };


// const getContactById = async (req, res) => {
//   const { contactId } = req.params;
//   const contact = await Contact.getContactById(contactId);
//   if (!contact) {
//     throw HttpError(404, "Not found");
//   }
//   res.status(200).json({
//     status: 'success',
//     code: 200,
//     data: { result: contact },
//   });
// };

// const addContact = async (req, res) => {
//   const result = await Contact.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     code: 201,
//     data: { result },
//   });
// };

// const removeContact = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await Contact.removeContact(contactId);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json({
//     message: "Contact deleted",
//   });
// };

// const upDateById = async (req, res) => {
//   const { contactId } = req.params;
//   if (Object.keys(req.body).length === 0) {
//     throw HttpError(400, 'missing fields');
//   }
 
//   const result = await Contact.updateById(contactId, req.body);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json({
//     status: 'success',
//     code: 201,
//     data: { result },
//   });
// };

// const updateStatus = async (req, res, next) => {
//   const { contactId } = req.params;
//   if (Object.keys(req.body).length === 0) {
//     throw HttpError(400, 'missing fields favorite');
//   }
//   const result = await updateStatusContact(contactId, req.body);
//   if (!result) {
//     throw HttpError(404, 'Not found');
//   }
//   res.status(200).json({
//     status: 'success',
//     code: 201,
//     data: { result },
//   });
// };



// module.exports = {
//   getAll: ctrlWrapper(getAll),
//   getContactById: ctrlWrapper(getContactById),
//   addContact: ctrlWrapper(addContact),
//   removeContact: ctrlWrapper(removeContact),
//   upDateById: ctrlWrapper(upDateById),
//   updateStatus: ctrlWrapper(updateStatus),
// };