module.exports = (theFunc) => (req, res) => {
    Promise.resolve(theFunc(req, res )).catch(res);
  };
  