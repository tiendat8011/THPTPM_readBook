module.exports.checkActive = async (req, res, next) => {
    try {
      console.log(req.user);  
      if (req.user.isActive == false){
          throw new Error();
      }
      next();
    } catch (e) {
      console.log({error: e})
      res
        .status(401)
        .send({ message: 'Not active account.' });
    }
  };