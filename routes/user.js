// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { signupBody, signinBody, updateBody } = require('../types');
const { authMiddleware } = require('../middleware');


//SignUp

/*
Request Body
{
    "username": "user2@gmail.com",
    "password": "123456",
    "firstName": "Mycroft", 
    "lastName": "Holmes"
}
*/ 
router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body) //Zod validation where {success} is objectuseed to destructure object(i.e. it will old the value of the object)
    console.log(success)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    console.log(existingUser)
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;


    

    //Initialising Random balance
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({  //User token generation
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token // passing token as response
    })
})


//SignIn
/*
Body :
{
    "username": "Lestrade@gmail.com",
    "password": "123456"

}

Headers : 
AUTHORIZATION Bearer "token" 

*/
router.post("/signin",authMiddleware, async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    console.log(success)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

//UserUpdate
/*
{
    "lastname": "Kasab"
}
*/
router.put("/", authMiddleware,async (req, res) => {
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    console.log(req.userId);
    await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })

})

//GetUser
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const firstName = req.body.firstName;
    const l = req.body.lastName;
    console.log(firstName);
 
    const users = await User.find({ 
        $or: [{                                 // $or is an array which stores data which satisfy mentioned conditions inside $or
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    const user = await User.findOne({ 
        firstName: firstName
    })

    
    res.json({
        user: users.map(user => ({          
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

    /*
    res.json({
        user
    })
    */
})




module.exports = router;