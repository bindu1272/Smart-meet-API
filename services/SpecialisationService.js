const { SpecializationRepository } = require('../repositories');

class SpecialisationService {
  constructor() {
    this.specializationRepo = new SpecializationRepository();
  }

  async search() {
    return await this.specializationRepo.getFor();
  }
}

module.exports = SpecialisationService;
