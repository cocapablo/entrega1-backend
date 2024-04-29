export default class CustomError {
    static createError({name = "Error", cause, message, code = 1}) {
        const error = new Error(message, {cause});
        
        error.isCustom = true;
        error.name = name;
        error.code = code;

        console.log("Error creado : " , error);

        throw error;
    }
}