   // check form from cilent
        (() => {
            'use strict'
          
            // find all form need to check
            const forms = document.querySelectorAll('.needs-validation')
          
            // loop and add submit event to each form
            Array.from(forms).forEach(form => {
              form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                  event.preventDefault()
                  event.stopPropagation()
                }
                form.classList.add('was-validated')
              }, false)
            })
          })()

          