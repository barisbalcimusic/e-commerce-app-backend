export const deleteSingleUser = async (req, res, next) => {
  try {
    console.log("test deleteSingleUser");

    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};
