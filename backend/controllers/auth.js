const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, username, password, profilePic } = req.body;
        if (!name || !username || !password) {
            return res.status(401).json({
                success: false,
                message: "Please Enter all the details"
            })
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already Exits"
            });
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in Hashing Password"
            });
        }
        const pic = `${process.env.PROFILE_URL}${name}`;
        const user = await User.create({
            name, username, password: hashedPassword, profilePic: pic
        })
        return res.status(200).json({
            success: true,
            message: "User created Successfully",
            user
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please fill all the details "
                }
            )
        }
        

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'User Not Registerd'
                }
            )
        }
        const payload = {
            username: user.username,
            name: user.name,
            id: user._id,
        } 
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: 'None',
                secure: true
            }
            // console.log(token);
            res.cookie("token", token, options).status(200).json(
                {
                    success: true,
                    token: token,
                    user: user,
                    message: "User LoggedIn successfully"
                }
            );

        } else {
            return res.status(403).json(
                {
                    success: false,
                    message: "Password Incorrect"
                }
            );
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                success: false,
                message: 'Login failure'
            }
        );
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: "User Logged Out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}