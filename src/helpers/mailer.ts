import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email, emailType, userID}:any)=>{
    try{
        //create hash token for id
        const hashedToken = await bcryptjs.hash(userID.toString(), 10)

       if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userID,
            {verifyToken: hashedToken, 
            verifyTokenExpiry: Date.now()+360000})
       } 
       else if(emailType === "RESET"){
        await User.findByIdAndUpdate(userID,
            {forgotPasswordToken: hashedToken, 
            forgotPasswordTokenExpiry: Date.now()+360000})
       }

       var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "e1b0637aaba3b0",
          pass: "7d14d440b30614"
          //TODO: ADD THESE CREDENTIALS TO .ENV FILE
        }
      });

      const mailOptions = {
        from: 'ethanmacalbright@gmail.com',
        to:email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="{process.env.domain}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY"?"verify your email":"reset your password"} or copy and paste the link into your browser. <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
      }

      const mailResponse = await transport.sendMail(mailOptions);
      return mailResponse;

    }
    catch(error:any){
        throw new Error(error.message);
    }


}