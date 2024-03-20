const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export default function isValidEmail(email) {
    return email.match(regex)
}

