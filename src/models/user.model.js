import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema( {

    username:{
        type:String,
        lowercase:true,
        unique:true,
        required:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
         index:true,
        trim:true
    },
    avatar:{
        type:String,
        requried:true
    },
    coverImage:{
        type:String,
        required:true,
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    password:{
        type:String,
        required:[true, 'password is required']
    },
    refreshToken:{
        type:String,
    },
    
},{timestamps:true}
)
userSchema.pre("save",async function (next){
if (this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password,10)
next()
})
userSchema.method.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id,
            email:this._email,
            fullName:this.fullName,
            username:this._username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.method.generateRefreshToken = function(){ return jwt.sign(
    {
        id: this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET, 
       {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)}

export const user = mongoose.model("user",user)


