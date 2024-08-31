import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './don.css'; // Utilisation d'un fichier CSS pour le style

// Charger Stripe avec votre clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  // États pour stocker les informations du formulaire
  const [amount, setAmount] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'succeeded' | 'failed' | 'processing'>('idle');
  
  const VITE_URL_API = import.meta.env.VITE_URL_API;

  // Obtenir le client_secret du backend pour initier le paiement
  const fetchPaymentIntent = async () => {
    setPaymentStatus('processing'); // Le paiement est en cours
    const res = await fetch(`${VITE_URL_API}/paiements/donation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: parseInt(amount, 10) * 100, // Convertir en cents
        currency: 'eur',
        nom,   // Envoyer le nom
        prenom, // Envoyer le prénom
        email  // Envoyer l'email
      }),
    });
    console.log("test1");
    const { clientSecret } = await res.json();
    setClientSecret(clientSecret);
    setPaymentStatus('succeeded');

  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("rayan")
    if (!stripe || !elements || !clientSecret) return;

    console.log('Début du traitement du paiement...');

    const cardElement = elements.getElement(CardElement);

    try {
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });
       
        console.log('Résultat du paiement :', result);

        if (result.error) {
            console.error('Erreur de paiement :', result.error.message);
            setPaymentStatus('failed');
        } else if (result.paymentIntent?.status === 'succeeded') {
            console.log('Paiement réussi');
            setPaymentStatus('succeeded');
        } else {
            console.log('Statut du paiement inattendu:', result.paymentIntent?.status);
            setPaymentStatus('failed');
        }
    } catch (error) {
        console.error('Erreur lors du traitement du paiement :', error);
        setPaymentStatus('failed');
    }
};



  // Réinitialiser le formulaire pour permettre un autre don
  const resetForm = () => {
    setAmount('');
    setNom('');
    setPrenom('');
    setEmail('');
    setClientSecret('');
    setPaymentStatus('idle');
    elements?.getElement(CardElement)?.clear();
  };

  return (
    <div>
      {paymentStatus === 'succeeded' ? (
        <div className="donation-success">
          <h2>Merci pour votre don !</h2>
          <p>Votre don de {amount}€ a été traité avec succès.</p>
          <button onClick={resetForm} className="donation-button">Faire un autre don</button>
        </div>
      ) : (
        <form className="donation-form" onSubmit={handleSubmit}>
          <h2 className="donation-title">Faire un don</h2>

          <label className="donation-label">Nom</label>
          <input
            className="donation-input"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label className="donation-label">Prénom</label>
          <input
            className="donation-input"
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />

          <label className="donation-label">Email</label>
          <input
            className="donation-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="donation-label">Montant du don (€)</label>
          <input
            className="donation-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <CardElement className="card-element" />
          
          <button
            className="donation-button"
            type="submit"
            disabled={!stripe || !elements || paymentStatus === 'processing'}
            onClick={fetchPaymentIntent}
          >
            {paymentStatus === 'processing' ? 'Traitement...' : 'Payer'}
          </button>

          {paymentStatus === 'failed' && <p className="error-message">Le paiement a échoué. Veuillez réessayer.</p>}
        </form>
      )}
    </div>
  );
};

const Don = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Don;
