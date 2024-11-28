import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from 'razorpay'
import Stripe from 'stripe'

// global variables 
const currency = 'inr'
const deliveryCharge = 10;

//gateway intialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})
// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, success_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// verify stripe controller function

const verifyStripe = async (req,res)=>{
    const {orderId, success, userId}=req.body
    try {
        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData:{}});
            res.json({success:false})
        }
      } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "razorpay",
            payment: false,
            date: Date.now(),
        };

        // Save the order to your database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Options for Razorpay order creation
        const options = {
            amount: amount * 100, // Convert amount to the smallest currency unit
            currency: currency.toUpperCase(), // Ensure the currency code is uppercase
            receipt: newOrder._id.toString(), // Receipt ID
        };

        // Create order using Razorpay's SDK
        const order = await razorpayInstance.orders.create(options);

        // Respond with the created order details
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req,res) => {
    try {
        const { userId, razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true,message:"Payment Failed"});
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {
        const {userId} =req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// update order status
const updateStatus = async (req, res) => {
  try {   
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Ensure orderId is treated as an ObjectId if necessary
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId }, // Correct filter format
      { status }, // Update the status field
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.json({ success: true, message: 'Status Updated', data: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {verifyRazorpay,verifyStripe, placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus }