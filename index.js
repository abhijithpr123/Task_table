let arr=null;
showData();
function addTask(event){
    event.preventDefault();
    let arr=JSON.parse(localStorage.getItem("task")) || [];
    let tname=document.getElementById("taskName").value;
    let tdate=document.getElementById("taskDate").value;
    let taskdata={tname:tname,tdate:tdate,status:false};
    arr.push(taskdata);
    localStorage.setItem("task",JSON.stringify(arr));
     showData();
};

function showData(){
     arr = JSON.parse(localStorage.getItem("task"));
    let HTML = "";
    
    arr.forEach((a,b) => {
        let statusname="";
       
        HTML += `
                  <tr>
                    <td><input type="checkbox" ${a.status?"checked":""} onchange="handleChange(${b})" name="" id="nam${b}"></td>
                    <td><span style="text-decoration:${a.status?"line-through":"none"}">${a.tname}</span></td>
                    <td>${a.status?"completed":"pending"}</td>
                    <td>${a.tdate}</td>
                    <td><button onclick="editData(${b})">Edit</button> <button onclick="deleteData(${b})">Delete</button></td>
                  </tr>   
                `});
    let table = document.getElementById("taskList");
    table.innerHTML = HTML;

  

};
function handleChange(b){
console.log(arr[b].status);
arr[b].status=!arr[b].status;
localStorage.setItem("task",JSON.stringify(arr))
showData()
}
function deleteData(b){
    let arr = JSON.parse(localStorage.getItem("task"));
    arr.splice(b,1);
    localStorage.setItem("task",JSON.stringify(arr));
    showData();
}
function editData(){

}
let popup = false;
function addBtn(){
    popup = !popup;
    popup?document.getElementById("popup").style.display="block":document.getElementById("popup").style.display="none"
}