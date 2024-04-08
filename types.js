const zod = require("zod");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

const menuBody = zod.object({
    cuisine: zod.string(),
    dish: zod.string(),
    description: zod.string(),
    
  });
module.exports = {
    signupBody: signupBody,
    signinBody: signinBody,
    updateBody: updateBody,
    menuBody: menuBody
}