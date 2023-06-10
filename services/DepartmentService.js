const {
  UserRepository,
  DepartmentRepository,
  HospitalUserRepository,
} = require('../repositories');
const DepartmentValidator = require('../validators/DepartmentValidator');
const { Op } = require('sequelize');

class DepartmentService {
  constructor(req) {
    this.req = req;
    this.user = App.lodash.get(req, 'user.detail');
    this.hospital = App.lodash.get(req, 'user.hospital');
    this.userRepo = new UserRepository(req);
    this.hospitalUserRepo = new HospitalUserRepository(req);
    this.departmentValidator = new DepartmentValidator();
    this.departmentRepo = new DepartmentRepository(req);
  }

  async createDepartment(inputs) {
    await this.departmentValidator.validate(inputs, 'create-department');
    return await this.departmentRepo.create({
      ...inputs,
      hospital_id: this.hospital,
    });
  }

  async updateDepartment(inputs) {
    await this.departmentValidator.validate(inputs, 'update-department');
    return await this.departmentRepo.update(
      App.helpers.objectExcept(inputs, ['uuid']),
      {
        where: {
          uuid: App.lodash.get(inputs, 'uuid'),
          hospital_id: this.hospital,
        },
      }
    );
  }

  async getDepartments(inputs) {
    return await this.departmentRepo.getFor({
      where: {
        hospital_id: this.hospital,
      },
    });
  }

  async assignDepartmentToDoctor(inputs) {
    await this.departmentValidator.validate(inputs, 'assign-department');
    let users = await this.userRepo.getFor({
      where: {
        uuid: {
          [Op.in]: App.lodash.get(inputs, 'doctor_uuid'),
        },
      },
    });

    let hospitalUsers = await this.hospitalUserRepo.getFor({
      where: {
        hospital_id: this.hospital,
        role_id: App.helpers.config('settings.roles.doctor.value'),
      },
    });

    let userIdArr = App.lodash.map(users, 'id');

    let doctorToAdd = App.lodash.filter(hospitalUsers, (hu) =>
      App.lodash.includes(userIdArr, App.lodash.get(hu, 'user_id'))
    );
    let doctorToRemove = App.lodash.filter(
      hospitalUsers,
      (hu) => !App.lodash.includes(userIdArr, App.lodash.get(hu, 'user_id'))
    );

    let department = await this.departmentRepo.getBy({
      uuid: App.lodash.get(inputs, 'uuid'),
      hospital_id: this.hospital,
    });
    // if(department!=null){
    //   await this.updateDepartment(doctorToAdd);
    // }else{
    //   await this.createDepartment(doctorToAdd);
    // }

    // await department.addDepartment_users(doctorToAdd);
    // await department.removeDepartment_users(doctorToRemove);
    return ;
  }

  async deleteDepartment(inputs) {
    // await this.ContactUsValidator.validate(inputs,'delete');
    return await this.departmentRepo.deleteDepartment(inputs.uuid);
}

}

module.exports = DepartmentService;
