export const updateUser = async (req, res, next) => {
  try {
    const { fieldToUpdate } = req.body;

    res.status(200).json({ message: `${fieldToUpdate} has been updated.` });
  } catch (error) {
    next(error);
  }
};
