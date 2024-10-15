const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    await hackedUser.save();
                }
            }
        );
        return res.sendStatus(403);
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                await foundUser.save();
                return res.sendStatus(403);
            }
            if (foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);
            const userId = foundUser._id.toString(); // Convert MongoDB ObjectId to string
            const username = foundUser.username; // Extract username from foundUser
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": username, // Use the extracted username
                        "roles": roles,
                        "userId": userId
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );

            const newRefreshToken = jwt.sign(
                {
                    "username": foundUser.username,
                    "userId": userId
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            // Send authorization roles, access token, and userId to the user
            res.json({ userId, user: username, roles, accessToken }); // Include user as username
        }
    );
}

module.exports = { handleRefreshToken };
