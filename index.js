const express = require("express");
const fs = require("fs");
let users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

//REST API POINTS WHICH WILL RETURN
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/users", (req, res) => {
  const html = `<ul>
    ${users.map((user) => `<li> ${user.email} </li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app.post("/api/users", (req, res) => {
  // TODO------> CREATE A NEW USER
  return res.json({ status: "pending" });
});

app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

    const body=req.body;
for(var i=0;i<users.length;i++){
if(id-1===i)
    users[i]={...body,id:id}


}

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) console.log(err);
  });

  return res.json({ status: "success" });
});

app.delete("/api/users/:id", (req, res) => {


    //req.paramas.id always returns a string which is required to be explicitly typecasted
    const id=Number(req.params.id);
    let userFound=0;
    for(var i=0;i<users.length;i++){

        if(users[i].id===id){
            userFound=1
            users.splice(i,1);
            fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
                if(err){
                    console.log(err)
                    return res.json({status:"error"})
                } 
            
            })
            
            break;
            
        }

    }
    
    if(!userFound) return res.json({status:"user Not found"})
    
        return res.json({status:"User Succesfully deleted"})

});

app.get("/api/users/:id", (req, res) => {
  //req.params.id will return a string
  console.log(typeof req.params.id);
  const id = Number(req.params.id);
  const myUser = users.find((user) => user.id === id);
  return res.json(myUser);
});

app.listen(PORT, () => {
  console.log(`server running at PORT${PORT}`);
});
/* syntax to club routes with different request methods 


app.route("/api/users/:id").get(gethandler).post(posthandler).patch(patchhandler)

*/
