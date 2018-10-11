import { firebaseAuth } from "./authorization.js";
'use strict';

// Mailbox API Object
export const mbLayer = {
    base_url: 'https://apilayer.net/api/',
    check_resource: 'check',
    key: '?access_key=5f6cbe1b6f7541e55af21cee645431df',

    validateEmail: () => {
        let usersEmail = $("#user-email").val().trim();
        $.ajax({
            url: `${mbLayer.base_url}${mbLayer.check_resource}${mbLayer.key}&email=${usersEmail}`,
            method: 'GET',
            success: (response => {
                if (response.smtp_check === true && response.role === false) {
                    console.log(response);
                    firebaseAuth.createUser()
                }
                else {
                    console.log(response);
                    // TODO: meaningful error message
                }
            }),
            error: (error => {
                console.log(`error`)
            })
        })
    }
}
