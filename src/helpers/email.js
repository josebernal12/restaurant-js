import emailjs from 'emailjs-com'

const generateEmail = async (name, email, token) => {
    const templateParams = {
        to_name: name,
        email: email,
        from_name: 'procrecer',
        message: `${name} para confirmar la cuenta haz click en el siguiente enlace `,
        my_html: `<a href=http://localhost:5173/confirmar-cuenta/${token}>Confirmar Cuenta</a>`
    }
    
    emailjs
        .send(
            'service_d1wwsmi',
            'template_sc614hq',
            templateParams,
            'Xz919CCqbZ5omJBF_'
        )
        .then(
            function (response) {
                console.log('SUCCESS', response, response.status, response.text)
            },
            function (error) {
                console.log('Faileed', error)
            }
        )
}

export const generateEmailByForgotPassword = (name, email, token) => {
    const templateParams = {
        to_name: name,
        email: email,
        from_name: "procrecer",
        message: `${name} has solicitado reestablecer tu password presiona el siguiente enlace `,
        my_html: `<a href=http://localhost:5173/olvide-password/${token}>Confirmar Cuenta</a>`,
    };

    emailjs
        .send(
            process.env.EMAIL_SERVICE,
            process.env.EMAIL_TEMPLATE,
            templateParams,
            process.env.EMAIL_PARAMS
        )
        .then(
            function (response) {
                console.log("SUCCESS", response, response.status, response.text);
            },
            function (error) {
                console.log("Faileed", error);
            }
        );
}

export default generateEmail




