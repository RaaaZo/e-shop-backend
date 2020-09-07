const User = require("../models/UserModel");
const HttpError = require("../models/http-error");

const registerUser = async (req, res, next) => {
  const { name, password, email } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  if (existedUser) {
    const error = new HttpError(
      "E-mail zajęty. Zaloguj się lub użyj innego e-maila.",
      501
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    password,
    email,
    cart: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  res.json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  if (!existedUser) {
    const error = new HttpError(
      "Nie znaleziono adresu e-mail. Jeśli nie masz konta zarejestruj się",
      401
    );

    return next(error);
  }

  if (existedUser && existedUser.password !== password) {
    const error = new HttpError("Błędne dane logowania", 401);

    return next(error);
  }

  res.json({
    message: "zalogowano",
    user: existedUser.toObject({ getters: true }),
  });
};

const postToCart = async (req, res, next) => {
  const { email, cart } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  try {
    existingUser.cart.push(cart);
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  res.json({ user: existingUser });
};

const getUser = async (req, res, next) => {
  const { userEmail } = req.params;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: userEmail });
  } catch (err) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Coś poszło nie tak, spróbuj ponownie", 500);

    return next(error);
  }

  res.json({ user: existingUser.toObject({ getters: true }) });
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.postToCart = postToCart;
exports.getUser = getUser;
