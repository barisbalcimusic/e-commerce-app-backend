export const logout = async (req, res, next) => {
  try {
    // CLEAR COOKIE
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
