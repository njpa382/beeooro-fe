const callController = {};

callController.redirect = (req, res) => {
  res.redirect("/index.html");
};

module.exports = callController;
