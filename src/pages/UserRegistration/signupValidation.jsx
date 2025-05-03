// signupValidation.js
import * as Yup from 'yup';

export const signupValidation = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(25, 'Name must be less than 25 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  cpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
