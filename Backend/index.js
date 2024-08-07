const connectdb = require('./database/db');
const express = require("express");
const cors = require('cors')
const app = express();
require('dotenv').config();
const authRouter = require('./routes/auth');
const groupRouter = require('./routes/group');
const userRouter = require('./routes/user');
const tweetRouter = require('./routes/tweet');
const conversationRouter = require('./routes/conversation');
const fileRouter = require('./routes/file');
const { createToken } = require('./controllers/livekit');
const ratingRouter = require('./routes/rating');
const inviteRouter = require('./routes/invite');
const subscriptionRouter = require('./routes/subscription');
const bodyParser = require('body-parser');
const { razorWebhook } = require('./webhook/razorpay');


const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors(
    { origin: "*" }
));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

//Available Routes
connectdb();

app.use('/api/file', fileRouter);
app.use('/api/auth', authRouter);
app.use('/api/group', groupRouter);
app.use('/api/user', userRouter);
app.use('/api/tweet', tweetRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/rate', ratingRouter);
app.use('/api/invite', inviteRouter);
app.use('/api/subscription', subscriptionRouter);
app.post('/api/livekit/getToken', async (req, res) => {
    const { roomId, username } = req.body;
    const token = await createToken(roomId, username);
    // console.log(token);
    return res.status(200).json({
        token
    });
});
app.post("/api/webhook/razor", razorWebhook);

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
})
