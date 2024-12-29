export const sendVerificationMail = async (transporter, mailOptions) => {
  try {
    //SEND VERIFICATION MAIL
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error on mail sending: ", error);
    return false;
  }
};
