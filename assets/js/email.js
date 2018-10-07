// Mailbox API Object
'use strict';

export const mbLayer = {
    base_url: 'https://apilayer.net/api/',
    check_resource: 'check',
    key: '?access_key=5f6cbe1b6f7541e55af21cee645431df',
    validEmail: false,

    validateEmail: (usersEmail) => {
        $.ajax({
            url: `${mbLayer.base_url}${mbLayer.check_resource}${mbLayer.key}&email=${usersEmail}`,
            method: 'GET',
            success: (response => {
                if (response.smtp_check && !reponse.role) {
                    mbLayer.validEmail = true;
                }
                console.log(mbLayer.validEmail)
                console.log(response)
            }),
            error: (error => {
                // TODO meaningful error message
                console.log(error)
            })
        })
    }
}
