function submission(){
    const name=document.getElementById("name").value;
    const number=document.getElementById("number").value;
    const mail=document.getElementById("mail").value;
    axios.post('http://localhost:3000/appointment/booking',{name,number,mail})
    
    .then(res=>{
        console.log(res);
        display(res.data)
        document.getElementById("name").value = '';
        document.getElementById("number").value = '';
        document.getElementById("mail").value = '';
    })
    .catch(err=>console.log(err))
}
function display(data){
    const tasklist=document.getElementById("tasklist");
    const list=document.createElement("li");
    list.textContent=data.name+" "+data.number+" "+data.mail;
    tasklist.appendChild(list);
}