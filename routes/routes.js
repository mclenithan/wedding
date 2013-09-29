
/*
 * GET home page.
 */

module.exports = function(app, db, passport){

  app.get('/', function(req, res, next) {
    if (req.user) {
      res.redirect('/console');
    }
    else{
      res.render('login');
    }
  });

  app.get('/console', function(req,res,next){
    if (!req.user) {
      res.redirect('/');
    }
    else{
      res.render('console');
    }
  })

  app.get('/session', function(req,res,next){
    if (!req.user){
      res.send(404);
    }
    else{
      res.send(200, req.user);
    }
  })

  //some REST routes
  app.post('/login', 
    passport.authenticate('local'),
    function(req,res,next){
      res.redirect('/console');
    });


};