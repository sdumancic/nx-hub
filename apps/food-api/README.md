GET http://localhost:8080/api/orders/search?status=placed&datePlacedFrom=2022-12-29&datePlacedTo=2022-12-30

POST http://localhost:8080/api/orders/place

``
{
"deliveryAddress": "Vukovarska 1",
"deliveryCity": "Čakovec",
"notes": "pozvoniti",
"deliveryLocation": {
"type": "Point",
"coordinates": [
16.484445,
46.374373
]
},
"orderItems": [
{
"quantity": 1,
"priceNoVat": 10,
"priceWithVat": 12.5,
"meal": {
"id": 2
},
"toppingsItems": [
{
"quantity": 2,
"priceNoVat": 2,
"priceWithVat": 2.5,
"topping": {
"id": 2
}
}
]
},
{
"quantity": 2,
"priceNoVat": 10,
"priceWithVat": 12.5,
"meal": {
"id": 3
}
}
]
}
``

