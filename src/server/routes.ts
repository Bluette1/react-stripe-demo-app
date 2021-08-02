import * as express from 'express';
const loadStripe = require("stripe");
import 'dotenv/config';

const router = express.Router();

router.get('/api/hello', (req, res, next) => {
    res.json('World');
});

const secret = process.env.REACT_APP_SECRET_KEY;
const stripe = loadStripe(secret);
const charge = async (token: string, amt: number) => {
  const data = await stripe.charges.create({
    'amount': amt * 999,
    'currency': 'usd',
    'description': 'Example charge',
    'source': token,
  });
  return data;
}

router.post('/api/donate', async(req, res, next) => {
    try {
      const data = await charge(req.body.token.id, req.body.amount);
      res.send('Payment Successful!');
    } catch (error) {
        console.log(error);
        res.status(500);
    }  
});

export default router;