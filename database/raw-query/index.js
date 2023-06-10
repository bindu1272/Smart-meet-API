module.exports = {
  defaults: {
    doctor_ratings: `Select SUM(rating) as total_rating,count(*)  as total_count from reviews rev INNER JOIN appointments ap on rev.owner_id = ap.id AND ap.doctor_id={doctor_id}  WHERE rev.owner_type = 'appointment'`,
    hospital_ratings: `Select SUM(rating) as total_rating,count(*) as total_count from reviews rev INNER JOIN appointments ap on rev.owner_id = ap.id AND ap.hospital_id={hospital_id}  WHERE rev.owner_type = 'hospital'`,
    get_near_by_hospitals:
      'SELECT id, ( 6371 * acos( cos( radians({input_lat}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians({input_long}) ) + sin( radians({input_lat}) ) * sin( radians( latitude ) ) ) ) AS distance FROM hospitals where city_id={city_id} ORDER BY distance',
  },
};
