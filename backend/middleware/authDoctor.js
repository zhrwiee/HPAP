import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  const { dtoken } = req.headers;
  if (!dtoken) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
  }

  try {
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.userId = token_decode.id; // ✅ SET THIS instead of req.body.docId
    next();
  } catch (error) {
    console.log('JWT Error:', error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authDoctor;