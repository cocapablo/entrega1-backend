class UserDTO {
    constructor({id = "", first_name ="", last_name ="", email ="", age = 1, password = "", role = "", cart = null, documents = []}) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = age,
        //Omito password
        this.role = role;
        this.cart = cart; 
        this.documents = documents;   
    }
}

export default UserDTO;