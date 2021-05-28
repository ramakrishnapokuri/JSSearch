export default class cacheService {
  constructor() {
    this.contacts = [];
  }

  add(contact) {
    this.contacts.push(contact);
  }

  change(id, key, value) {
    const index = this.contacts.findIndex((a) => a.id === id);
    if (index >= 0) {
      this.contacts[index][key] = value;
    }
  }

  delete(id) {
    const index = this.contacts.findIndex((a) => a.id === id);
    if (index >= 0) {
      this.contacts.splice(index);
    }
  }

  getContacts() {
    return this.contacts;
  }
}
