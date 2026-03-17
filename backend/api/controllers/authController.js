const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body

    // Validation:check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required " })
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        })

        res.status(201).json({
            id: user.id,
            user,
            token: generateToken(user.id),
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error registering User", error: err.message })
    }
}

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required " })
    }
    try {
        const user = await User.findOne({ where: { email } })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        res.status(200).json({
            id: user.id,
            user,
            token: generateToken(user.id),
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in User", error: err.message })
    }
}

// Get user info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: "Error getting user info", error: err.message })
    }
}

// Update User Info
exports.updateUserInfo = async (req, res) => {
    try {
        const { fullName, email, password, profileImageUrl } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;

        if (password && password.trim() !== "") {
            user.password = password;
        }

        await user.save();

        res.json({
            id: user.id,
            user,
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating user info", error: err.message });
    }
};
