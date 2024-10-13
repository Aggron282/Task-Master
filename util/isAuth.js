const isAuth = (req,res,next)=>{

  if(!req.session.isAuthenticated || !req.user){
    res.redirect("/auth/login");
    res.end();
  }
  else{
    next();
  }

}

module.exports = isAuth;
