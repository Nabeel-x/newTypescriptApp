document.addEventListener('DOMContentLoaded',()=>{
    const displayField = document.getElementById('display');
    async function display(){
        const response = await fetch('/person',{
            method: 'POST'
        });
        const data = await response.json();
        let htmlText = `<tr><th>Name</th><th>Age</th><th>Salary</th></tr>`;
        for(let Emp of data){
            htmlText += `<tr><td>${Emp.name}</td><td>${Emp.age}</td><td>${Emp.salary}</td></tr>`;
        }
        displayField.innerHTML = htmlText;
    }
    display();
});