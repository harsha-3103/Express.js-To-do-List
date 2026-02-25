const express = require ("express");
const app = new express();
const fs = require("fs/promises");

app.use(express.json());

app.post("/add", async (req, res) => {
    try{
        let content = JSON.stringify(req.body.todo) + "\n";
        try{
            await fs.appendFile("info.txt", content, "utf-8");
            console.log("file saved successfully");
        }catch(err){
            return res.status(500).send("error occured while trying ot append the item to the file");
        }

        return res.status(200).send("To-do added successfully");
    }
    catch(err){
        return res.status(500).send("sorry an unexpected server error occured");
    }
})

app.delete("/delete", async (req, res) => {
    try{
        const body = JSON.stringify(req.body.todo);

        let info;

        try{
            info = await fs.readFile("info.txt", "utf-8");
            console.log("successfuly read the file"); 
        }catch (err){
            return res.status(500).send("there was an eroor trying to read the file")
        }

        let lines = info.split("\n").filter(line => line.trim() !== "");

        const index = lines.indexOf(body);
        if (index === -1){ // .indexOf() only returns either a valid index number or -1
            return res.status(404).send("content not found in the file"); //this is an error within the try block since it is an expected logical condition that needs to be fulfilled to go ahead, it is not a general/specific technical error.
        }
        
        lines.splice(index, 1);
        let newcontent = lines.join("\n") + "\n";
;
        
        try{
            await fs.writeFile("info.txt", newcontent, "utf-8");
            console.log("successfully wrote updated content to the file");
        }catch (err){
            return res.status(500).send("there was an error trying to write updated content to the file");
        }

        return res.status(200).send("To-do deleted successfully");
    }
    catch (err){
        return res.status(500).send("sorry an unexpected server error occured");
    }
    
})

app.put("/update/:number", async (req, res) => {
    try{
        const body = JSON.stringify(req.body.todo);
        const index = Number(req.params.number) - 1; //tells which to-do to update

        let info;

        try{
            await fs.readFile("info.txt", "utf-8");
            console.log("file read successfully");
        }catch(err){
            res.status(500).send("sorry there was an error while trying to read the file")
        }

        let lines = info.split("\n").filter(line => line.trim() !== "");

        if (index < 0 || index >= lines.length){
            return res.status(404).send("sorry the to-do you want to replce doesnt exist");
        }   

        lines[index] = body;
        let newcontent = lines.join("\n") + "\n";

        try{
            await fs.writeFile("info.txt", newcontent, "utf-8");
            console.log("file saved successfully, To-do updated");
        }catch (err){
            return res.status(500).send("sorry there was an error while writing to the file");
        }

        return res.status(200).send("To-do updated successfully");

    }catch(err){
        return res.status(500).send("sorry an unexpected server error occured");
    }
})

app.get("/get", async (req, res) =>{
    try{
        let info;

        try{
            info = await fs.readFile("info.txt", "utf-8",);
            console.log("file read successfully");
        }catch(err){
            return res.status(500).send("sorry there was an error while reading the file");
        }

        const lines = info.split("\n").filter(line => line.trim() !== "");
        return res.json(lines.map(x => JSON.parse(x)));


    }catch(err){
        return res.status(500).send("sorry an unexpected server error occured");
    }
})

app.listen(3000);