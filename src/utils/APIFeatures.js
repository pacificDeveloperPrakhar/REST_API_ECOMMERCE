module.exports=class APIFeatures{
  constructor(query,queryString){
    this.query=query;
    this.queryString=queryString;
    this.query.find();
    
  }
  sort(){
  
    this.query.sort(this.queryString?.sort?.split(",").join(" "));
  }
  filter(){
  
    
      const excludeFields = ["page", "sort", "limit","fields" ];
  let query = JSON.parse(JSON.stringify(this.queryString));
  excludeFields.forEach((el) => delete query[el]);
  query = JSON.stringify(query).replace(
    /(gte)|(gt)|(lte)|(lt)/g,
    (match) => `$${match}`
  );
  query = JSON.parse(query);
 this.query.find(query)   
  }
fields(){
  this.query.select(this.queryString?.fields?.split(",")?.join(" "));
  console.log("fields")
}
page(){
 
  const limit = this.queryString?.limit * 1 || 10;
  const page = this.queryString?.page * 1 || 1;
  const skip = (page - 1) * limit;
  this.query.skip(skip).limit(limit);
}
}