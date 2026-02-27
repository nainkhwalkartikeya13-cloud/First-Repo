import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: `Invalid Object of: ${req.params.id}` });
  }
  next();
}

export default checkId;
