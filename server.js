const express = require('express');
const mongoose = require('mongoose');
const myRouter = require('./routes/index');
const keys = require('./config/index');
const cors = require('cors');
const chalk = require('chalk');
const {seed} = require('./seedData/seed')
mongoose
  .connect(keys.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to database successfully ${keys.mongo_uri}`)
    return await seed()
      .then(() => {
        console.log("Seed success!");
      })
      .catch((e) => {      
        console.log(e.stack);
      });
  })
  .catch(console.log);
const app = express();

app.use(cors());

app.use(express.json()); 


app.use('/uploads', express.static('./uploads'));
app.use('/api', myRouter);
app.use('/', express.static('./public')); 
app.use('/docs', require('./routes/docs')); 

const port = process.env.PORT || keys.port; //heroku cap port or lay local
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
