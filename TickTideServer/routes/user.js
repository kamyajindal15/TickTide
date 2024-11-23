const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate username length
        if (username.length < 4) {
            return res.status(400).json({ message: "Username should have at least 4 characters" });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashPass = await bcrypt.hash(req.body.password, 10);
        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
        });
        await newUser.save();

        return res.status(200).json({ message: "User Registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }
    bcrypt.compare(password, existingUser.password, (err,data) => {
        if(data) {
            const authClaims = [{ name: username },{ jti:jwt.sign({}, "TickTide")}];
            const token = jwt.sign({ authClaims }, "TickTide", { expiresIn: "2d" });
            const email=existingUser.email;
            res.status(200).json({ id: existingUser._id,username ,email, token: token });
        }
        else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    })
})
module.exports = router;
