export const logout = async (req, res, next) => {
  try {
    // CLEAR COOKIE
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    });
    res.status(200).json({ message: "Logout successfull." });
  } catch (error) {
    next(error);
  }
};
