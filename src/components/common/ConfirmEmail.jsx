// // src/pages/ConfirmEmail.tsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import supabase from "../supabaseClient";

// const ConfirmEmail = () => {
//   const [searchParams] = useSearchParams();
//   const [confirmationStatus, setConfirmationStatus] =
//     (useState < string) | (null > null);

//   useEffect(() => {
//     const confirmEmail = async () => {
//       const token = searchParams.get("token");

//       if (!token) {
//         setConfirmationStatus("Invalid confirmation link.");
//         return;
//       }

//       try {
//         const { data, error } = await supabase
//           .from("users")
//           .update({ email_confirmed: true, confirmation_token: null })
//           .eq("confirmation_token", token)
//           .select();

//         if (error) {
//           console.error("Error confirming email:", error);
//           setConfirmationStatus("Error confirming email.");
//         } else if (data && data.length > 0) {
//           setConfirmationStatus("Email confirmed successfully!");
//         } else {
//           setConfirmationStatus("Invalid or expired confirmation link.");
//         }
//       } catch (err) {
//         console.error("Unexpected error during email confirmation:", err);
//         setConfirmationStatus("Unexpected error during email confirmation");
//       }
//     };
//     confirmEmail();
//   }, [searchParams]);

//   return (
//     <div>
//       {confirmationStatus ? (
//         <p>{confirmationStatus}</p>
//       ) : (
//         <p>Confirming email...</p>
//       )}
//     </div>
//   );
// };

// export default ConfirmEmail;
