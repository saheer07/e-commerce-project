import * as Yup from 'yup';

export const signupValidation = Yup.object({
  name: Yup.string().min(3).required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6).required('Password is required'),
  cpassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});
