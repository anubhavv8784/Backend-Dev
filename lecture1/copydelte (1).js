const fs=required("fs")
fs.copyFile("./testing.txt","copied.txt",(err)=>
{
    if(err){
        console.log("error")
        return;
    }
    console.log("File Copied")

});

try{
    fs.readFileSync("copied.txt", "utf-8")
        console.log("File is copied");
}
catch(err){
    console.log("Error while copying file")
}
fs.unlink("newFile.txt",(err)=>{
    if(err){
        console.log("Error while delteing file")
        return;
    }
    console.log("file deleted")
});

fs.writeFile("newFile.txt", "This is a new file",(err)=>{
    if(err){
        console.log("Error while writing file")
        return;
    }
    console.log("File is created")
});


fs.mkdir("filders/folder1/folder2",(recursive:true),(err)=>{
    if(err){
            console.log("Error while reading file");
            

        return;
    }
    console.log("Directory is created")
})
fs.readdir("File-handling",(err,file)=>{
    if(err){
        console.log("error ")
        return;
        
    }
    console.log("")
})





