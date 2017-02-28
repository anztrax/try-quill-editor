import express from 'express';
import path from 'path';
import IndexPage from '../src/components/routes';

const app = express();
app.set('views', path.join(__dirname,'/components/page'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
app.get('/', IndexPage);

app.use('/dist', express.static('dist'));

app.listen(5500, ()=>{
  console.log('Example app listening on port 5500!');
});