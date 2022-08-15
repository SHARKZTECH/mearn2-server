const router=require("express").Router();
const User=require("../model/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");

const {registerValidation,loginValidation}=require("../validate")

router.post('/register',async (req,res)=>{
const {error}=registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message);

const emailExist=await User.findOne({email:req.body.email});
if(emailExist) return res.status(400).send("Email already taken!")

const salt=await bcrypt.genSalt(10);
const hashPassword=await bcrypt.hash(req.body.password,salt)

const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword
    });
        try{
        const savedUser= await user.save();
        res.send({user:user._id});
    }catch(err){
        res.status(400).send(err);
    }
});


router.post("/login",async (req,res)=>{
    const {error}=loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Email or Password is Incorrect");

    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send("Invalid Password");
    
    const token=jwt.sign({_id:user._id},"secrete_token");
    res.header('auth-token',token).send(token);
})

module.exports=router;