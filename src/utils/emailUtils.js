// // src/utils/emailUtils.ts  
// import { Resend } from 'resend';  

// const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);  
// const baseUrl = import.meta.env.VITE_BASE_URL;  


// export const sendConfirmationEmail = async (email, token) => {  
//   try {  
//     const confirmationLink = `${baseUrl}/confirm-email?token=${token}`;  
//       const data = await resend.emails.send({  
//         from: 'onboarding@resend.dev',  
//         to: [email],  
//         subject: 'Confirm your email',  
//         html: `<p>Please click this link to confirm your email: <a href="${confirmationLink}">Confirm Email</a></p>`,  
//       });  
//       console.log("Email sent:", data);  
//     } catch (error) {  
//       console.error("Error sending email:", error);  
//     }  
// };