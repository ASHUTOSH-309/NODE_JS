const express = require("express");
const fs = require("fs");
let users = require("./MOCK_DATA.json");
const app = express();
const mongoose = require("mongoose");
const { type } = require("os");

const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app")
  .then(() => {
    console.log("mongodb conneceted Succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: false }));

        //REST API POINTS WHICH WILL RETURN
          app.get("/api/users",async  (req, res) => {
              const allDbusers=await User.find({})
                

                 return res.json(allDbusers);
          });




app.get("/users",async (req, res) => {

  const allDbusers=await User.find({})

  const html = `<ul>
                    ${allDbusers.map((user) => `<li> ${user.firstName}--${user.email} </li>`).join("")}
               </ul>`;
  res.send(html);
});



app.post("/api/users", async (req, res) => {
  const body=req.body;


  if(!body.email || !body.first_Name || !body.last_Name || !body.job_title || !body.gender){
      return res.status(400).json({status:"All fields are requied"})

  }


  const result=await User.create({

    firstName:body.first_Name,
    lastName:body.last_Name,
    email:body.email,
    jobTitle:body.job_title,
    gender:body.gender

  })
console.log(result)
  return res.status(201).json({ msg: "success" });
});



app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const body = req.body;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) users[i] = { ...body, id: id };
  }

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) console.log(err);
  });

  return res.json({ status: "success" });
});

app.delete("/api/users/:id", (req, res) => {
  //req.paramas.id always returns a string which is required to be explicitly typecasted
  const id = Number(req.params.id);
  let userFound = 0;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      userFound = 1;
      users.splice(i, 1);
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
          console.log(err);
          return res.json({ status: "error" });
        }
      });

      break;
    }
  }

  if (!userFound) return res.json({ status: "user Not found" });

  return res.json({ status: "User Succesfully deleted" });
});

app.get("/api/users/:id",async (req, res) => {
  //req.params.id will return a string
 


  const user=await User.findById(req.params.id);
  if(!user) res.status(404).json({error:"No user with the given id exist"})
  
    return res.json(user);


});

app.listen(PORT, () => {
  console.log(`server running at PORT${PORT}`);
});
/* syntax to club routes with different request methods 


app.route("/api/users/:id").get(gethandler).post(posthandler).patch(patchhandler)

*/
