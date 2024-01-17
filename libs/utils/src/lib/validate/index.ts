// import * as yup from 'yup';
// import { AlertTitleTextWarning } from 'libs/ui/src/lib/Alert';

// export const validateEmail = async (email: string): Promise<string | null> => {
//   const schema = yup
//     .string()
//     .email('Invalid email format')
//     .required('Email is required');

//   try {
//     await schema.validate(email);
//     return null;
//   } catch (error: unknown) {
//     if (error instanceof yup.ValidationError) {
//       return error.errors.email.message;
//     } else {
//       // Xử lý các kiểu lỗi khác nếu cần thiết
//       throw error; // Rethrow nếu không phải là yup.ValidationError
//     }
//   }
// };