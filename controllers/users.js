
const User = require('../models/user');



module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
    
};

module.exports.createNewUser = async (req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({username,email});
    const registerdUser = await User.register(user,password);
    req.login(registerdUser,err =>{
        if (err) return next(err);
        req.flash('success','Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    })

    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
};


module.exports.login = (req,res)=>{
    req.flash('success','welcome back!')
    let backUrl = req.session.back || '/campgrounds'
    if(backUrl.includes('?_method=DELETE')){
        backUrl = '/campgrounds'
        res.redirect(backUrl)
    }else{
        
        res.redirect(backUrl)
    }
};

module.exports.logout = (req,res)=>{
    req.logOut(),
    req.flash('success','Successfully logout!')
    res.redirect('/campgrounds')
}