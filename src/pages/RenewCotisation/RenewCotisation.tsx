import React, { useState } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './RenewCotisation.css';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const RenewCotisation = () => {
    const [adherentType, setAdherentType] = useState('');
    const [amount, setAmount] = useState(0);
    const [formData, setFormData] = useState({ name: '', prenom: '', email: '' });
    const stripe = useStripe();
    const elements = useElements();
 

    const handleAdherentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setAdherentType(value);
    
        let selectedAmount = 0;
        if (value === 'student') selectedAmount = 1000;  // 10€ en centimes
        if (value === 'employee') selectedAmount = 2000;  // 20€ en centimes
        if (value === 'company') selectedAmount = 3000;   // 30€ en centimes
        setAmount(selectedAmount);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
   
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Vérifier si elements et stripe ne sont pas null
        if (!elements) {
            console.error('Stripe elements not found');
            alert('Erreur : Les éléments de paiement ne sont pas disponibles.');
            return;
        }
    
        if (!stripe) {
            console.error('Stripe not initialized');
            alert('Erreur : Le service de paiement Stripe n\'est pas disponible.');
            return;
        }
    
        try {
            const startDate = new Date();
            const expirationDate = new Date(startDate);
            expirationDate.setFullYear(startDate.getFullYear() + 1); // Prolonger d'un an
    
            // Envoyer la requête de paiement et de renouvellement de cotisation
            const paymentRes = await axios.post(`${import.meta.env.VITE_URL_API}/paiements/cotisation`, {
                amount,
                currency: 'eur',
                email: formData.email,
                category: adherentType,
                description: 'Renouvellement de cotisation adhérent',
                startDate,
                expirationDate
            });
    
            const { clientSecret } = paymentRes.data;
    
            // Récupérer CardElement et vérifier qu'il n'est pas null
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                console.error('CardElement not found');
                alert('Erreur : L\'élément de carte bancaire n\'est pas disponible.');
                return;
            }
    
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: formData.name,
                        email: formData.email,
                    },
                },
            });
    
            if (paymentResult.error) {
                console.error(paymentResult.error.message);
                alert('Erreur de paiement');
            } else if (paymentResult.paymentIntent?.status === 'succeeded') {
                alert('Renouvellement réussi!');
            }
        } catch (error) {
            console.error('Erreur lors du renouvellement', error);
            alert('Erreur lors du renouvellement de la cotisation.');
        }
    };
    
    

    return (
        <div className="renew-container">
            <h1>Renouveler votre cotisation</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>

                <label>
                    Prénom:
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} required />
                </label>

                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
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
                    Numéro de carte:
                    <CardElement />
                </label>

                <button type="submit">Renouveler</button>
            </form>
        </div>
    );
};
const ReCotisation = () => (
    <Elements stripe={stripePromise}>
      <RenewCotisation />
    </Elements>
  );
export default ReCotisation;
