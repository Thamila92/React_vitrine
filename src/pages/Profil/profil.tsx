import React, { useState } from 'react';
import './profil.css';

const Profile = () => {
    const [userData, setUserData] = useState(() => {
      const userJSON = localStorage.getItem('user');
      console.log("User JSON:", userJSON);
       // Vérifiez si les données sont récupérées
       if (userJSON) {
        const parsedUser = JSON.parse(userJSON);

        // Formater la date de naissance au format 'YYYY-MM-DD' pour l'input de type 'date'
        if (parsedUser.dateDeNaissance) {
            parsedUser.dateDeNaissance = new Date(parsedUser.dateDeNaissance).toISOString().split('T')[0];
        }

        return parsedUser;
    } else {
        return {
            name: '',
            adresse: '',
            dateDeNaissance: '', // Initialisation vide
            email: '',
            password: '',
            actual_password: '',
            new_password: ''
        };
    }
});

    const [isEditingEmailPassword, setIsEditingEmailPassword] = useState(false); // Contrôle si l'email et le mot de passe sont éditables
    const [isRenewingSubscription, setIsRenewingSubscription] = useState(false); // Nouvel état pour le formulaire de renouvellement

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        // Initialisez un objet vide pour ajouter dynamiquement les propriétés
        const dataToUpdate: { [key: string]: any } = {};
    
        // Ajouter les champs de profil qui ne nécessitent pas de mot de passe
        if (userData.name) dataToUpdate.name = userData.name;
        if (userData.adresse) dataToUpdate.adresse = userData.adresse;
        if (userData.dateDeNaissance) dataToUpdate.dateDeNaissance = userData.dateDeNaissance;
    
        // Si l'utilisateur modifie son mot de passe, ajoutez les champs nécessaires
        if (isEditingEmailPassword) {
            if (userData.email) dataToUpdate.email = userData.email;
            if (userData.actual_password && userData.new_password) {
                dataToUpdate.actual_password = userData.actual_password;
                dataToUpdate.password = userData.new_password;
            }
        }
    
        try {
            // Récupérez l'ID de l'utilisateur depuis userData ou d'une autre source
            const userId = userData.id; // Assurez-vous que l'ID utilisateur est stocké dans userData
    
            // Utilisation de l'URL API à partir des variables d'environnement
            const VITE_URL_API = import.meta.env.VITE_URL_API;
    
            // Effectuer la requête PATCH à l'URL dynamique
            const response = await fetch(`${VITE_URL_API}/updateUser/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde des informations');
            }
    
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Informations sauvegardées avec succès !');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la sauvegarde des informations.');
        }
    };
    
    

    const handleEditEmailPassword = () => {
        setIsEditingEmailPassword(true);
        setUserData({
            ...userData,
            actual_password: '', // Réinitialiser les champs de mot de passe
            new_password: ''
        });
    };
    const handleRenewMembership = () => {
        // Afficher le formulaire de paiement
        setIsRenewingSubscription(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        // Logique de gestion du paiement ici (par exemple, appel Stripe API)
        alert("Paiement soumis !");
        // Après soumission, vous pouvez cacher le formulaire ou réinitialiser l'état si besoin
        setIsRenewingSubscription(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Avatar"
                    className="profile-avatar"
                />
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
               <button className="profile-action-btn" onClick={handleRenewMembership}>
                    Renouveler mon adhésion
                </button>
            </div>
            <div className="profile-content">
                <h1>Paramètre de profil</h1>
                <div className="profile-form">
                    <div className="profile-section">
                        <label>Nom Prénom</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                        />

                        <label>Adresse</label>
                        <input
                            type="text"
                            name="adresse"
                            value={userData.adresse}
                            onChange={handleInputChange}
                        />

                        <label>Date de naissance</label>
                        <input
                            type="date"
                            name="dateDeNaissance"
                            value={userData.dateDeNaissance}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="profile-section">
                        <h2>Paramètre Confidentialité</h2>
                        
                        {/* Email et mot de passe gestion */}
                        {isEditingEmailPassword ? (
                            <>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                />

                                <label>Ancien Mot de passe</label>
                                <input
                                    type="password"
                                    name="actual_password"
                                    value={userData.actual_password}
                                    onChange={handleInputChange}
                                />

                                <label>Nouveau Mot de passe</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={userData.new_password}
                                    onChange={handleInputChange}
                                />
                            </>
                        ) : (
                            <>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    disabled
                                />

                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    disabled
                                />
                                <button className="manage-btn" onClick={handleEditEmailPassword}>
                                    Gérer
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <button onClick={handleSave} className="save-btn">Sauvegarder</button>
            </div>
        </div>
    );
};

export default Profile;
