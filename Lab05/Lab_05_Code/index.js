const express = require("express");
const app = express();

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
const upload = multer();

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
