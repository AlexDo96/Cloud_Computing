const express = require("express");
const path = require("path");
const app = express();
const { v4: uuid } = require("uuid");

// Config server side render MVC
app.use(express.json({ extend: false }));
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

// Config AWS DynamoDB
const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId: 'AKIAXQ4DUQKFXGDDBIPT',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
});
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'SanPham';

// Using Multer
const multer = require('multer');
const strorage = multer.memoryStorage({
    desination(req, file, callback) {
        callback(null, '');
    },
});

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const minetype = fileTypes.test(file.minetype);
    if (extname && minetype) {
        return cb(null, true);
    }

    return cb("Error: Image Only");
}

const upload = multer({
    strorage,
    limits: { fileSize: 2000000 },
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});

const CLOUD_FRONT_URL = 'https://d3sm3c7d85ow8g.cloudfront.net';

app.post('/', upload.single('image'), (request, response) => {
    const { ma_sp, ten_sp, so_luong } = request.body;
    const image = request.file.originalname.split(".");

    const fileType = image[image.length - 1];

    const filePath = `${uuid() + Date.now().toString()}.${fileType}`;
    const params = {
        Bucket: "uploads3-toturial-bucket",
        Key: filePath,
        Body: request.file.buffer
    };

    s3.upload(params, (error, data) => {
        if (error) {
            console.log("error = ", error);
            return response.send('Internal Server Error');
        } else {
            const newItem = {
                TableName: tableName,
                Item: {
                    "ma_sp": ma_sp,
                    "ten_sp": ten_sp,
                    "so_luong": so_luong,
                    "image_url": `${CLOUD_FRONT_URL}${filePath}`
                }
            }

            docClient.put(newItem, (err, data) => {
                if (err) {
                    console.log("error = ", error);
                    return response.send('Internal Server Error');
                } else {
                    return response.redirect("/");
                }
            });
        }
    });
});

app.get('/', (request, response) => {
    const params = {
        TableName: tableName,
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            response.send('Internal Server Error');
        } else {
            return response.render('index', { sanPhams: data.Items });
        }
    });
});

app.post('/', upload.fields([]), (request, response) => {
    const { ma_sp, ten_sp, so_luong } = request.body;

    const params = {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong
        }
    };

    docClient.put(params, (err, data) => {
        if (err) {
            return response.send('Internal Server Error');
        } else {
            return response.redirect("/");
        }
    });
});

app.post('/delete', upload.fields([]), (request, response) => {
    const listItems = Object.keys(request.body);

    if (listItems.length === 0) {
        return response.redirect("/");
    }

    function onDeleteItem(index) {
        const params = {
            TableName: tableName,
            Key: {
                "ma_sp": listItems[index]
            }
        }

        docClient.delete(params, (err, data) => {
            if (err) {
                return response.send('Internal Server Error');
            } else {
                if (index > 0) {
                    onDeleteItem(index - 1);
                } else {
                    return response.redirect("/");
                }
            }
        });
    };

    onDeleteItem(listItems.length - 1);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});
