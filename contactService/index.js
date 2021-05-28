// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

export default class {
  constructor(updates, service, cacheService) {
    this.cacheService = cacheService;
    updates.on("add", (id) => {
      service.getById(id).then((contact) => {
        this.cacheService.add(contact);
      });
    });
    updates.on("change", (id, field, value) =>
      this.cacheService.change(id, field, value)
    );
    updates.on("remove", (id) => this.cacheService.delete(id));
  }

  /**
   * Searches the query and return the matched records
   * @param {*} query query to match
   * @returns matched records
   */
  search(query) {
    const result = [];
    this.cacheService.getContacts().forEach((contact) => {
      if (this.isFound(contact, query)) {
        result.push(this.format(contact));
      }
    });

    return result;
  }

  /**
   * format the contact to user output way
   * @param {*} contact contact
   * @returns formatted contact
   */
  format(contact) {
    const obj = {
      name: `${contact.nickName || contact.firstName} ${contact.lastName}`,
      phones: [this.formatPhoneNumber(contact.primaryPhoneNumber)],
      email: contact.primaryEmail || contact.secondaryEmail,
      address:
        `${contact.addressLine1}  ${contact.addressLine2} ${contact.addressLine3} ${contact.city} ${contact.state} ${contact.zipCode} `.trim(),
      id: contact.id
    };
    if (contact.secondaryPhoneNumber) {
      obj.phones.push(this.formatPhoneNumber(contact.secondaryPhoneNumber));
    }
    return obj;
  }

  /**
   * format the phone number
   * @param {*} phoneNumberString phone number
   * @returns formatted phone number
   */
  formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return ["(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  }

  /**
   * match the query with the any of the contact key
   * @param {*} contact contact
   * @param {*} query query to search
   * @returns true/false
   */
  isFound(contact, query) {
    const phoneNumber = contact["primaryPhoneNumber"].replace(/-/g, "");
    const phoneQuery = query.replace(/[^0-9]/g, "");
    if (
      contact["firstName"].includes(query) ||
      contact["lastName"].includes(query) ||
      `${contact["firstName"]} ${contact["lastName"]}`.includes(query) ||
      `${contact["nickName"]} ${contact["lastName"]}`.includes(query) ||
      contact["primaryEmail"].includes(query) ||
      contact["secondaryEmail"].includes(query) ||
      (phoneNumber && phoneQuery && phoneNumber.includes(phoneQuery))
    ) {
      return true;
    }

    return false;
  }
}
