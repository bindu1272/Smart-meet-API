module.exports = (currentHospital, hospitals) => {
  let currentHospitals = App.lodash.filter(hospitals, [
    'id',
    App.lodash.get(currentHospital, 'id'),
  ]);
  roles = App.lodash.map(currentHospitals, 'HospitalUser.role_id');
  hospitals = App.lodash.uniqBy(hospitals, 'id');

  return {
    roles,
    userCurrentHospital: currentHospital,
    userHospitals: hospitals,
  };
};
