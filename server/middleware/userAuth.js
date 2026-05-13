import jwt from "jsonwebtoken";
 

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDecode || !tokenDecode.id) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });  
  }
};
