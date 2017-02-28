const indexRoute = (req,res) =>{
  res.render('Index',{
    name : 'john'
  });
};

export default indexRoute;