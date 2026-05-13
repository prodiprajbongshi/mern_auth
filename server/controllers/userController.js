
import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found.",
      });
    }

    res.json({
      success: true,
      userData: {
        user: user.name,
        email: user.email,
        isAccountVirefy: user.isAccountVirefy, 
      },
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message, 
    });
  }
};
