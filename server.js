const app = require('./app');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const server = app.listen(port, (err)=>{
    if(err) console.log(err);
    else console.log(`Server is Up and running on PORT : ${port}`);
});