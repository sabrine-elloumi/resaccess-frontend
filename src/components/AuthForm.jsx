import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // Pour afficher les erreurs du serveur
  const navigate = useNavigate(); // Pour rediriger après succès

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError(""); // Efface l'erreur serveur
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validation côté client
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

    if (Object.keys(newErrors).length > 0) return;

    try {
      const url = type === "login" 
        ? "http://localhost:5000/api/auth/login"
        .trim() 
        : "http://localhost:5000/api/auth/register";

      const body = type === "login"
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password, 
            confirmPassword: formData.confirmPassword 
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Erreur du serveur (ex: champs requis, mot de passe invalide, etc.)
        setServerError(data.message || "Une erreur est survenue");
        return;
      }

      // Succès : connexion ou inscription
      console.log("Succès :", data);

      // Optionnel : sauvegarder le token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        alias: data.alias
      }));

      // Rediriger après succès
      navigate("/dashboard"); // Change selon ta route

    } catch (err) {
      console.error("Erreur réseau :", err);
      setServerError("Impossible de se connecter au serveur.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {serverError && <p className="error-text server-error">{serverError}</p>}

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
