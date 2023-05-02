const Contact = require('../models/contact');

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async contactId => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return null;
  }
  return contact;
};

const removeContact = async contactId => {
  const result = await Contact.findByIdAndDelete(contactId);
  return result;
};

const addContact = async body => {
  const data = Contact.create(body);
  return data;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(contactId, body);
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(contactId, body);
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};