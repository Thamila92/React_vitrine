import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './signup.css';

// Load your Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        skills: '',             // Store skills as a string, e.g., "skill1, skill2"
        address: '',
        dateDeNaissance: '',     // Changed to match your backend's expectation
    });

    // Separate state for adherentType (only used for payment)
    const [adherentType, setAdherentType] = useState(''); // Not part of formData

    const [amount, setAmount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle the selection of adherentType (not part of the form state)
    const handleAdherentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setAdherentType(value);

        // Update the amount based on the selected adherent type
        let selectedAmount = 0;
        if (value === 'student') selectedAmount = 1000;  // 10 EUR in cents
        if (value === 'employee') selectedAmount = 2000; // 20 EUR in cents
        if (value === 'company') selectedAmount = 3000;  // 30 EUR in cents
        setAmount(selectedAmount);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Ensure Stripe and Elements are loaded
        if (!stripe || !elements) {
            return;
        }

        try {
            // Step 1: Create a payment intent on the backend
            const paymentRes = await axios.post(`${import.meta.env.VITE_URL_API}/paiements/cotisation`, {
                amount,
                currency: 'eur',
                email: formData.email,
                category: adherentType,  // Send adherentType only for the payment
                description: 'Création de compte adhérent'
            });

            const { clientSecret } = paymentRes.data;

            // Step 2: Confirm the payment using Stripe's confirmCardPayment method
            const cardElement = elements.getElement(CardElement);

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: {
                        name: formData.name,
                        email: formData.email,
                    },
                },
            });

            if (paymentResult.error) {
                // Show error to your customer
                alert(paymentResult.error.message);
                setIsSubmitting(false);
                return;
            }

            if (paymentResult.paymentIntent?.status === 'succeeded') {
                // Step 3: If payment is successful, create the user account
                const userRes = await axios.post(`${import.meta.env.VITE_URL_API}/adherent/signup`, {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    skills: formData.skills.split(','),  // Convert skills string into an array
                    address: formData.address,
                    dateDeNaissance: formData.dateDeNaissance  // Send the correct field
                });

                if (userRes.status === 201) {
                    alert("Account created successfully!");
                }
            }
        } catch (error) {
            console.error("Payment or registration error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <label>
                    Nom:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>

                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </label>

                <label>
                    Mot de passe:
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={8} />
                </label>

                <label>
                    Compétences (séparées par des virgules):
                    <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} />
                </label>

                <label>
                    Adresse:
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
                </label>

                <label>
                    Date de naissance:
                    <input type="date" name="dateDeNaissance" value={formData.dateDeNaissance} onChange={handleInputChange} />
                </label>

                <label>
                    Type d'adhérent:
                    <select name="adherentType" value={adherentType} onChange={handleAdherentTypeChange} required>
                        <option value="">Sélectionnez votre type</option>
                        <option value="student">Étudiant - 10€ / mois</option>
                        <option value="employee">Salarié - 20€ / mois</option>
                        <option value="company">Entreprise - 30€ / mois</option>
                    </select>
                </label>

                <label>
                    Détails de la carte:
                    <CardElement />
                </label>

                <button type="submit" disabled={!stripe || isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'S\'inscrire'}
                </button>
            </form>
        </div>
    );
};

const Signup = () => {
    return (
        <Elements stripe={stripePromise}>
            <SignupForm />
        </Elements>
    );
};

export default Signup;
