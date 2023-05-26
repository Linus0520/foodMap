(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                  
                    event.preventDefault()
                    event.stopPropagation()
                  
                }else if(form.checkValidity()){
                 
                    form.getElementsByClassName("btn-disabled")[0].disabled = 'true'
                }
                form.classList.add('was-validated')
            }, false)
        })
})()