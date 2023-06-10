const ContactUsRepository = require('../repositories/ContactUsRepository');
const ContactUsValidator = require('../validators/ContactUsValidator');
const { User } = require('../models');


class ContactUsService {
    constructor(req){
    this.user = App.lodash.get(req, 'user.detail');
    this.contactUsRepo = new ContactUsRepository(req);
    this.ContactUsValidator = new ContactUsValidator();

    }
    async contactUs(inputs){
      await this.ContactUsValidator.validate(inputs, 'create');
       await this.contactUsRepo.create({
            name: App.lodash.get(inputs, 'name'),
            email: App.lodash.get(inputs, 'email'),
            phone: App.lodash.get(inputs, 'phone'),
            comments: App.lodash.get(inputs, 'comments'),
            image : App.lodash.get(inputs,'image'),
            image_url : App.lodash.get(inputs,'image_url'),
            user_id :App.lodash.get(this.user,'id'),
          });
    }
    // async getAll(){
    //    return await this.contactUsRepo.getFor(
    //     {},
    //     true,
    //     {
    //     include: [
    //       {
    //         model: User,
    //         as: 'user',
    //         required: false,
            
    //       }
    //     ]
    //    });
    // }
    async getAll(searchObj = {}) {
      return await this.contactUsRepo.getAll(searchObj)
    }
    async delete(inputs) {
        await this.ContactUsValidator.validate(inputs,'delete');
        return await this.contactUsRepo.deleteComment(inputs.uuid);
    }
    async get(req){
      // await this.ContactUsValidator.validate(req, 'get');
      return await this.contactUsRepo.get(req)
    }
}
module.exports = ContactUsService;