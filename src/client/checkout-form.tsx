import React, {useState} from 'react';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [values, setValues] = useState({
		name: '',
		amount: '',
	});

	const handleNameInputChange = (e) => {
		e.persist();
		setValues((values) => ({
			...values,
			name: e.target.value,
		}));
	}
	
	const handleAmountInputChange = (e) => {
		e.persist();
		setValues((values) => ({
			...values,
			amount: e.target.value,
		}));
	}

	const handleSubmit = async(e) => {
		e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
		const cardElement = elements.getElement(CardElement);

		try {
			const { token } = await stripe.createToken(cardElement);
			const { amount } = values;
			console.log('Token: ', token);
			await fetch('/api/donate',{
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({token, amount}),
				//redirect, clear input, alert thank you
			}
			)
		} catch (error) {
			throw error;
		}
	}

	return (
		<main className="container">
			<form
			onSubmit={handleSubmit}
			className="form-group border mt-3 border-primary rounded shadow-lg p-3"
			>
				<input type="text"
				className="input-group my-1 p-1 border border-dark" 
				value={values.name}
				onChange={handleNameInputChange}
				/>
				<input type="text"
				className="input-group my-1 p-1 border border-dark" 
				value={values.amount}
				onChange={handleAmountInputChange}
				/>
				<label htmlFor="card-element">
					Credit Card Number --Exp. date --CVC
				</label>
				<CardElement className="p-2 border border-dark mb-2"/>
				<button
				type="submit" 
				disabled={!stripe}
				className="btn btn-primary border border-dark"
				>Pay</button>
			</form>
		</main>
	);
};

interface CheckoutFormProps {}

export default CheckoutForm;