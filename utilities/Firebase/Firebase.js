const firebaseSdk = require("firebase");
const Models = require('../../models');
const sequelize = Models.sequelize;
const Op = sequelize.Op;
const { User, Order, OrderItem } = Models;
const { UserTransformer, OrderTransformer } = require('../../transformers/Response/v2');
const BaseController = require('../../http/controllers/api/v1/BaseController');
const {
    UserRepository,
    OrderRepository
} = require('../../repositories');

class Firebase {
    constructor(req) {
        // console.log({
        //     apiKey: App.env.FIREBASE_API_KEY,
        //     authDomain: App.env.FIREBASE_AUTH_DOMAIN,
        //     databaseURL: App.env.FIREBASE_DB_URL,
        //     projectId: App.env.FIREBASE_PROJ_ID,
        //     storageBucket: App.env.FIREBASE_STORAGE_BUCKET,
        //     messagingSenderId: App.env.FIREBASE_MESSAGING_SENDER_ID
        // })
        this.req = req;
        if (!firebaseSdk.apps.length) {
            firebaseSdk.initializeApp({
                apiKey: App.env.FIREBASE_API_KEY,
                authDomain: App.env.FIREBASE_AUTH_DOMAIN,
                databaseURL: App.env.FIREBASE_DB_URL,
                projectId: App.env.FIREBASE_PROJ_ID,
                storageBucket: App.env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: App.env.FIREBASE_MESSAGING_SENDER_ID
            });
        }
    }

    async execRead() {
        var ordersDbRef = firebaseSdk.firestore().collection('orders');
        return ordersDbRef.where('order_items', 'array-contains', {
            max_amount: 10,
        }).get().then(
            (results) => {
                results.forEach((doc) => {})
            }
        )
    }

    async pushOrdersForSalesReps( salesRepUser, orders,date ) {

       date = date || App.moment().format('YYYY-MM-DD');

        var dbRef = await firebaseSdk.firestore().collection('sales-reps-new');

        let transformed =await  BaseController.getTransformedData(this.req, salesRepUser, UserTransformer);

        console.log('firebase writes -- ',transformed);

        await dbRef.doc(transformed.id)
            .set(transformed)
            .then((ref) => {
                console.log('Pushing sales rep user');
            });

        await dbRef.doc(transformed.id)
            .collection('orders')
            .doc(date)
            .set({
                date: date,
                orders: [],
            })
            .then((ref) => {
                console.log('Pushing sales rep user');
            });

            this.req.query=App.helpers.cloneObj(this.req.query,{
                includes:'order_items,product_grade,order_shortage_items,sales_rep_user,seller_user,product'
            })

        let transformedOrders = await  BaseController.getTransformedData(this.req, orders, OrderTransformer);
        await dbRef.doc(transformed.id)
            .collection('orders')
            .doc(date)
            .update(
                { orders: firebaseSdk.firestore.FieldValue.arrayUnion(...transformedOrders) }    
            )
            .then((ref) => {
                console.log(`Pushing orders for sales rep: ${transformed.id}`);
            });

    }
}

module.exports = Firebase;