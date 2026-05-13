import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/userModel.js";
import { transporter } from "../config/nodeMailer.js";

// import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    const existingUserEmail = await userModel.findOne({ email });
    const existingUserName = await userModel.findOne({ name });

    if (existingUserEmail || existingUserName) {
      return res.json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    // send welcome email to user
      const mailOption = {  
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Welcome to Our Platform",
        text: `Hello ${user.name},\n\nWelcome to our platform! Your account has been created successfully. using this email: ${user.email}\n\nBest Regards,\nThe Team`
      };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "User Registered Successfully",
      user
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// // login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password Required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login Successful" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.isAccountVirefy) {
      return res.json({ success: false, message: "Account Already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.sendVerifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    // Send OTP email
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
      // html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{enail}}", user.email )
    };

    await transporter.sendMail(mailOption);
    res.json({ success: true, message: "Verification OTP sent to email" });
  } catch (error) {

    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Fetch the user with latest data
    const user = await userModel.findById(userId).lean();
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    // console.log("Stored OTP:", user.sendVerifyOtp, "Received OTP:", otp);

    if (!user.sendVerifyOtp || String(user.sendVerifyOtp) !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    // Mark account as verified
    await userModel.findByIdAndUpdate(userId, {
      isAccountVirefy: true,
      sendVerifyOtp: "",
      verifyOtpExpireAt: 0,
    });

    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// // password reset

// export const sendResetOtp = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.json({
//       success: false,
//       massage: "email Is Required",
//     });
//   }
//   try {
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({
//         success: false,
//         massage: "User Not Found",
//       });
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000));

//     user.resetOtp = otp;
//     user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

//     await user.save();

//     // Send OTP email
//     const mailOption = {
//       from: process.env.SENDER_EMAIL,
//       to: user.email,
//       subject: "Password Reset OTP",
//       // text: `Your OTP for resetting your password is ${otp}
//       //   Use this OTP to proceed with resetting your password.`,
//       html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{enail}}", user.email )
//     };
//     await transporter.sendMail(mailOption);

//     res.json({ success: true, message: "OTP Send To Your Email" });
//   } catch (error) {
//     return res.json({
//       success: false,
//       massage: error.massage,
//     });
//   }
// };

// // reset user password
// export const resetPassword  = async (req, res) => {

//   const {email, otp, newPassword} = req.body;
//   console.log("Request Body:", req.body);

//   if(!email || !otp || !newPassword){
//     return res.json({
//       success: false,
//       massage : "Email, Otp and NewPassword Is Requred"
//     })
//   }

//   try {
//     const user = await userModel.findOne({email});

//     if(!user){
//       return  res.json({
//         success: false,
//         massage : "User Not Found."
//       })
//     }
//     if(user.resetOtp == "" || user.resetOtp !== otp){
//       return res.json({
//          success: false,
//         massage : "Invalid OTP."
//       })
//     }
//     if(user.resetOtpExpireAt < Date.now()){
//       return res.json({
//         success: false,
//        massage : "OTP Expired"
//      })
//     }

//     const hashPassword = await bcrypt.hash(newPassword, 10)

//     user.password = hashPassword;
//     user.resetOtp = "";
//     user.resetOtpExpireAt = "";
//     await user.save();

//     return res.json({
//         success: true,
//        massage : "Password has been reset successfully"
//     })

//   } catch (error) {
//     return res.json({
//       success: false,
//       massage: error.massage,
//     })
//   }
// }











