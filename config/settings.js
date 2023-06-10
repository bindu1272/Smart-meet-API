module.exports = {
  brand: {
    support: {
      emails: [''],
    },
  },

  bcrypt: {
    saltRounds: 10,
  },

  pagination: {
    limit: {
      default: 20,
      max: 100,
    },
  },

  hospital_status: {
    pending: { name: 'Pending', value: 0 },
    verfied: { name: 'Verfied', value: 1 },
    reject: { name: 'Rejected', value: 2 },
  },

  roles: {
    superAdmin: { name: 'SuperAdmin', value: 1 },
    admin: { name: 'Admin', value: 2 },
    doctor: { name: 'Doctor', value: 3 },
    manager: { name: 'Manager', value: 4 },
    delegate: { name: 'Delegate', value: 5 },
    patient: { name: 'Patient', value: 6 },
    hospitalAgent: { name:'HospitalAgent', value: 7}
  },

  billingMethods: {
    per_appointment: { name: 'Per Appointment', value: 1 },
    per_hospital: { name: 'Per Hospital', value: 2 },
    per_Doctor: { name: 'Per Doctor', value: 3 },
  },

  invoiceStatus: {
    pending: { name: 'Pending', value: 0 },
    paid: { name: 'Paid', value: 1 },
  },

  consultationMode: {
    inClinic: { name: 'In-Clinic', value: 1 },
    videoConsult: { name: 'Video Consultation', value: 2 },
  },

  consultationFor: {
    mySelf: { name: 'Myself', value: 1 },
    family: { name: 'Family', value: 2 },
    emergency:{name: 'Emergency',value:3}
  },

  invite_link: {
    status: {
      created: { name: 'Created', value: 0 },
      verified: { name: 'Verified', value: 1 },
      expired: { name: 'Expired', value: 2 },
    },
    owner_type: {
      doctor_registration: {
        name: 'Doctor Registration',
        value: 1,
      },

      staff_registration: {
        name: 'Staff Registration',
        value: 2,
      },

      patient_registration: {
        name: 'Patient Registration',
        value: 3,
      },

      staff_forgot_password: {
        name: 'Staff Forgot password',
        value: 4,
      },
      hospital_agent_registration: {
        name: 'Hospital Agent Registration',
        value: 5
      }
    },
  },

  appointment_status: {
    incomplete: { name: 'In complete', value: 0 },
    pending: { name: 'Pending', value: 1 },
    noShow: { name: 'No Show', value: 2 },
    done: { name: 'Done', value: 3 },
    cancelled: { name: 'Cancelled', value: 4 },
  },

  claim_status: {
    pending: { name: 'Pending', value: 0 },
    processing: {name: 'Processing', value: 1},
    with_medicare: { name: 'With Medicare', value: 2 },
  },

  otp: {
    status: {
      created: { name: 'Created', value: 0 },
      verified: { name: 'Verified', value: 1 },
      expired: { name: 'Expired', value: 2 },
    },
    media_type: {
      email: { name: 'Email', value: 1 },
      phone: { name: 'Phone', value: 2 },
    },
    owner_type: {
      hospital_registration: {
        name: 'Hospital Registration',
        value: 1,
      },
      create_appointment: {
        name: 'Create Appointment',
        value: 2,
      },
      patient_registration: {
        name: 'Patient Registration',
        value: 3,
      },
    },
  },

  transformer: {
    paramKey: 'includes',
  },

  demoFaqs: [
    {
      question: 'Demo question 1',
      answer: 'answer 1',
    },
    {
      question: 'Demo question 2',
      answer: 'answer 2',
    },
    {
      question: 'Demo question 3',
      answer: 'answer 3',
    },
    {
      question: 'Demo question 4',
      answer: 'answer 4',
    },
    {
      question: 'Demo question 5',
      answer: 'answer 5',
    },
  ],
};
