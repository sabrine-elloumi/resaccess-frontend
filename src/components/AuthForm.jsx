import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthForm.css";

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // efface l’erreur du champ modifié
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validation basique
    if (type === "signup" && !formData.name.trim()) {
      newErrors.name = "Veuillez entrer votre nom complet.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Veuillez entrer une adresse e-mail.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Veuillez entrer un mot de passe.";
    }
    if (type === "signup" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Formulaire envoyé :", formData);

      try {
        const url =
          type === "login"
            ? "http://localhost:5000/api/auth/login"
            : "http://localhost:5000/api/auth/register";

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Erreur de connexion");
          return;
        }

        console.log("✅ Succès :", data);
        alert(
          type === "login"
            ? "Connexion réussie !"
            : "Inscription réussie !"
        );

        // Exemple : sauvegarder le token et rediriger
        // localStorage.setItem("token", data.token);
        // navigate("/dashboard");

      } catch (error) {
        console.error("Erreur lors de l'appel API :", error);
        alert("Erreur de serveur");
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {type === "signup" && (
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
      )}

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      {type === "signup" && (
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>
      )}

      <button type="submit" className="auth-button">
        {type === "login" ? "Se connecter" : "Créer mon compte"}
      </button>

      {type === "login" ? (
        <p className="auth-switch">
          Pas encore de compte ? <Link to="/signup">S’inscrire</Link>
        </p>
      ) : (
        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      )}
    </form>
  );
}

