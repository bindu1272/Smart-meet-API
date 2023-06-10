module.exports = {
  defaults: {
    error: 'Something went wrong, try again later!',
    // ...
  },

  email: {
    manager_invite: {
      subject: '{hospitalName}-invitation ',
      message:
        'You are invited to join {hospitalName}, as {Role}, please click the below link  to accept request',
    },
    hospital_agent_invite: {
      subject: '{hospitalName}-invitation ',
      message:
        'You are invited to join {hospitalName}, as {Role}, please click the below link  to accept request',
    },
    doctor_invite: {
      subject: '{hospitalName}-invitation ',
      message:
        'You are invited to join {hospitalName}, as {Role}, please click the below link  to accept request',
    },
    admin_invite: {
      subject: '{hospitalName}-invitation ',
      message:
        'You are invited to join {hospitalName}, as {Role}, please click the below link  to accept request',
    },
    staff_forgot_password: {
      subject: 'Smart Meet | Forgot password ',
      message: 'Please click the below link to reset your password',
    },
    hospital_verification_otp: {
      subject: 'Smart Meet | Hospital Verification Code ',
      message:
        'Thank you for onboarding on SmartMeet, here is your verification code {otp}',
    },
    create_appointment_otp: {
      subject: 'Smart Meet | Email Verification ',
      message:
        'Thank you for creating appointment on SmartMeet, here is your verification code {otp}',
    },
    patient_registration_otp: {
      subject: 'Smart Meet | Email Verification ',
      message:
        'Thank you for registering on SmartMeet, here is your verification code {otp}',
    },
  },

  errorMessages: {
    invoice: {
      alreadyPaid: 'Invoice already marked paid',
    },
    city: {
      alreadyExists: 'City already Exist with this name',
    },
    auth: {
      invalidCredentials: 'Please enter valid Email ID and password',
      noHospitalAssigned: 'No hospital assigned to you',
      userNotExist: 'No user which this email exist in smart meet',
      noHospitalExists: 'User is not associated with any hospital',
      noHospitalPermission:
        "You don't have permisssion to access this hospital",
      invalidForgotPasswordLink: 'Invalid Forgot Password link',
    },
    rating: {
      ratingExists: 'Rating already exists for this appointment',
    },
    doctor: {
      doctorAlreadyExists: 'User already exists for this hospital',
      expireInviteLink: 'Oops...Link is already expire',
    },
    otp: {
      invalidOtp: 'Invalid Otp..please try again',
      otpNotExists: 'No Otp exists for this number',
    },
    hospital: {
      alreadyMarkedActive: 'Hospital Already Marked Avtive',
    },
    appointments: {
      invalidSlots: 'Invalid slot selected',
      alreadyVerfiedAppointment: 'Appointment is already verified',
      noAppointmentExists: 'No such appointment exists',
      alreadyCompleted:
        "Appointment can't be reschedule, as it is already marked completed",

      noCanceableAppointment: "Appointment can't be mark cancelled",
    },
    appointmentNotes: {
      notAuthorised: 'You are not authorised to add/update the medical history',
    },
    staffInvition: {
      invalidRole: 'You are trying to send invitation for invalid role',
      notAccess: "You don't have access to send this invitation",
      adminAlreadyExist:
        'Admin already exist with this email for this hospital',
      managerAlreadyExist:
        'Manager already exist with this email for this department',
    },
    doctorLeave: {
      alreadyExists: 'Leave already exists for this date',
    },
    claim: {
      alreadyExists: 'Claim already exists for this appointment',
    },
  },
};
