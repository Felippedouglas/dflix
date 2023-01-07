import styled from "styled-components";

export const BackgroundCoontainerLogin = styled.div `
    display: flex;
    flex-direction: column;
    position: relative;
    background: ${props => props.darkMode ? '#181818' : '#fff'};
    color: ${props => props.darkMode ? '#fff' : '#181818'};
    width: 100%;
    height: 100vh;
    padding: 20px;
    z-index: 100;
    overflow-y: auto;
    transition: all .5s ease;

    .nav-logo-dark-mode {
        display: flex;
        justify-content: space-between;
    }

    .logo-dflix-login {
        display: flex;
        max-width: max-content;
    }

    .logo-dflix-login img {
        height: 30px;
    }

    .nav-logo-dark-mode button {
        background: #e50914;
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 50%;
        height: 35px;
        width: 35px;
        font-size: 1.2rem;
        transition: all .3s ease;
    }

    .nav-logo-dark-mode button:hover {
        opacity: .8;
    }

`

export const ContainerLogin = styled.div `

    display: flex;
    border-radius: 10px;
    width: 85%;
    max-width: 1000px;
    margin: auto;
    padding: 10px;
    background: ${props => props.darkMode ? '#202020' : '#f7f7f7'};
    transition: all .3s ease;

    aside {
        display: flex;
        align-items: center;
        width: 50%;
        border-radius: 10px 0 0 10px;
        padding: 10px;
    }

    aside img {
        width: 500px;
        margin: 0 auto;
    }

    .div-login, .div-cadastrar, .div-redefinir-senha {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 10px;
        width: 50%;
        background: ${props => props.darkMode ? '#202020' : '#f7f7f7'};
        border-radius: 20px 10px 10px 20px;
        transition: all .3s ease;
    }

    .div-login::after, .div-cadastrar::after, .div-redefinir-senha::after {
        content: '';
        width: 2px;
        height: 80%;
        background: ${props => props.darkMode ? '#404040' : '#aaa'};
        position: absolute;
        left: 40px;
        border-radius: 50px;
    }

    .div-login h2, .div-cadastrar h2, .div-redefinir-senha h2 {
        margin-bottom: 20px;
        font-size: 2rem;
    }

    .form-login-cadastrar fieldset, .form-login-cadastrar fieldset  {
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .form-login-cadastrar legend, .form-login-cadastrar legend  {
        margin-left: 5px;
        padding: 0 5px 0 5px;
        font-weight: 600;
    }

    .form-login-cadastrar input, .form-login-cadastrar input {
        padding: 5px 5px 10px 5px;
        width: 200px;
        background: none;
        color: ${props => props.darkMode ? '#fff' : '#181818'};
        border: none;
        outline: none;
        font-size: .9rem;
    }

    .bt-redefinir-senha {
        position: relative;
        right: -80px;
        background: none;
        border: none;
        color: #f00;
        cursor: pointer;
        margin: -10px 0 10px 0;
        border-bottom: 1px solid;
        transition: all .3s ease;
    }

    .bt-redefinir-senha:hover {
        color: #9d0109;
    }

    .bt-login-cadastrar {
        padding: 10px 30px;
        margin: 10px 0;
        cursor: pointer;
        font-weight: 600;
        background: #e50914;
        color: #fff;
        border: none;
        border-radius: 5px;
        transition: all .3s ease;
    }

    .bt-login-cadastrar:hover {
        opacity: .8;
    }

    .span-ou {
        position: relative;
        display: flex;
        align-items: center;
    }

    .span-ou::before {
        content: '';
        display: flex;
        position: relative;
        background: ${props => props.darkMode ? '#fff' : '#181818'};
        width: 45%;
        height: 1px;
        margin-right: 10px;
    }

    .span-ou::after {
        content: '';
        display: flex;
        position: relative;
        background: ${props => props.darkMode ? '#fff' : '#181818'};
        width: 45%;
        height: 1px;
        margin-left: 10px;
    }

    .div-login-alternativo {
        display: flex;
        flex-direction: column;
    }

    .div-login-alternativo .google {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        padding: 10px 20px;
        font-weight: 600;
        font-size: .8rem;
        cursor: pointer;
        background: #ddd;
        border: 1px solid #aaa;
        border-radius: 5px;
        transition: all .3s ease;
    }

    .div-login-alternativo .google:hover {
        background: #ccc;
    }

    .div-login-alternativo .google img {
        width: 15px;
        margin-right: 5px;
    }

    .span-link-login-cadastrar {
        background: none;
        font-size: .8rem;
    }

    .span-link-login-cadastrar button {
        background: none;
        border: none;
        outline: none;
        color: #007bcd;
        border-bottom: 1px solid transparent;
        font-weight: 600;
        cursor: pointer;
    }

    .span-link-login-cadastrar button:hover {
        border-bottom: 1px solid #007bcd;
    }

    .span-erro-login {
        color: #f00;
        font-weight: 600;
        font-size: .8rem;
        margin: 5px 0;
    }

    @media (max-width: 1000px) {
        
        aside img {
            width: 400px;
        }

        .div-login::after, .div-cadastrar::after, .div-redefinir-senha::after {
            display: none;
        }

    }

    @media (max-width: 800px) {
        flex-direction: column;
        padding: 20px;
        background: none;

        .aside-background-login {
            display: none;
        }
        
        aside {
            width: 100%;
            margin: 0 auto;
        }

        aside img {
            width: 300px;
        }
        
        .div-login, .div-cadastrar, .div-redefinir-senha {
            border-radius: 10px;
            width: 100%;
            background: none;
        }

    }

    @media (max-width: 600px) {

        width: 95%;

        aside img {
            width: 70%;
        }
    }

    @media (max-width: 400px) {

        padding: 0;
        margin: 20px 0 0 0;

        .email-redefinir-enviado {
            padding: 0;
            margin-top: 20px;
        }

        .div-redefinir-senha h2 {
            font-size: 1.4rem;
            text-align: center;
        }
        
        aside img {
            width: 100%;
        }
    }

`