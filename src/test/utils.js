import { fakerES as faker } from "@faker-js/faker";



export function generateProduct() {
    let product = {};

    product = {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.commerce.productMaterial(),
        stock: faker.number.int({min: 1, max: 10000}),
        category: faker.commerce.department(),
        status: true
    }

    return product;
}