const jwtHelper = require("./Authencation");
var User = require('../model/users');

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "TranTanDatNodejs";

let isAuth = async(req, res, next) => {
    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
    const tokenFromClient = req.user.Token.access_token || req.body.token || req.query.token || req.headers["x-access-token"];

    // console.log("token>>>", req.user.Token.access_token);
    // const tokenFromClient = req.cookies.access_token;
    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = decoded;

            // Cho phép req đi tiếp sang controller.
            next();
        } catch (error) {
            // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:

            return res.status(401).json({
                message: 'Unauthorized.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
}
let isAdmin = (req, res, next) => {
    User.findOne({ $and: [{ _id: req.user._id }, { Roles: "Administrator" }] }, function(err, result) {
        if (err)
            throw err;
        if (result)
            next();
        else
            return res.status(403).send({
                message: 'Denied permission.',
            });
    });
}

let isMod = (req, res, next) => {
    User.findOne({ $and: [{ _id: req.user._id }, { Roles: "Moderator" }] }, function(err, result) {
        if (err)
            throw err;
        if (result)
            next();
        else
            return res.status(403).send({
                message: 'Denied permission.',
            });
    });
}
module.exports = {
    isAuth: isAuth,
    isAdmin: isAdmin,
    isMod: isMod
};