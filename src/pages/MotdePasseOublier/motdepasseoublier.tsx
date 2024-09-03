import React, { useState } from 'react';
import './motdepasseoublier.css';
import emailjs from '@emailjs/browser';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const VITE_URL_API = import.meta.env.VITE_URL_API;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Envoyer une requête pour récupérer l'utilisateur par email
        try {
            const response = await fetch(`${VITE_URL_API}/users/email/${email}`);
            const user = await response.json();

            if (response.status === 404 || !user) {
                setMessage("Cet email n'est associé à aucun compte.");
                return;
            }

            // Générer un mot de passe aléatoire
            const newPassword = generateRandomPassword();

            // Mettre à jour le mot de passe de l'utilisateur
            const updateResponse = await fetch(`${VITE_URL_API}/updateUser/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            if (updateResponse.ok) {
                setMessage('Un nouveau mot de passe a été envoyé à votre adresse email.');
                // Envoyer un email avec le nouveau mot de passe
                sendPasswordEmail(user, newPassword);
            } else {
                setMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
            }
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
            setMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
        }
    };

    const generateRandomPassword = () => {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        // Ajouter au moins un chiffre, une majuscule et un caractère spécial
        if (!/[A-Z]/.test(password)) {
            password += 'A'; // Ajouter une majuscule si nécessaire
        }
        if (!/[0-9]/.test(password)) {
            password += '1'; // Ajouter un chiffre si nécessaire
        }
        if (!/[!@#$%^&*()_+]/.test(password)) {
            password += '!'; // Ajouter un caractère spécial si nécessaire
        }

        return password;
    };

    const sendPasswordEmail = (user: any, newPassword: string) => {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OTHER;
        const userId = import.meta.env.VITE_EMAILJS_USER_ID;
        
        const messageContent = `
        Bonjour ${user.name},

        Votre mot de passe a été réinitialisé. Voici votre nouveau mot de passe :

        ${newPassword}

        Veuillez vous connecter et changer votre mot de passe depuis votre profil.

        Cordialement,
        L'équipe de support
        `;

        emailjs.send(serviceId, templateId, {
            to_name: user.name,
            from_subject: "Réinitialisation de votre mot de passe",
            message: messageContent,
            user_email: user.email,
        }, userId)
        .then((result) => {
            console.log('Email envoyé avec succès:', result.text);
        }, (error) => {
            console.error('Erreur lors de l\'envoi de l\'email:', error.text);
        });
    };
 
    return (
        <div className="forgot-password-container">
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Adresse email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Réinitialiser le mot de passe</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
