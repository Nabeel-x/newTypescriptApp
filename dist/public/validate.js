document.addEventListener('DOMContentLoaded',()=>{
    const form = document.getElementById('LoginForm');
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const data = {
            name: form.name.value,
            pass: form.password.value
        };
        console.log(data);
        //random validation event;
        form.submit();
    });
});