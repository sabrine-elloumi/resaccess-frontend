import React, { useState } from "react";
import axios from "axios";

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (type === "register") {
        const res = await axios.post("http://localhost:5000/api/auth/register", formData);
        setSuccess("Inscription réussie !");
        console.log("✅ Utilisateur inscrit :", res.data);
      } else if (type === "login") {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        setSuccess("Connexion réussie !");
        console.log("✅ Utilisateur connecté :", res.data);
      }
    } catch (err) {
      console.error("❌ Erreur :", err);
      if (err.response) setError(err.response.data.message);
      else setError("Erreur de connexion au serveur");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {type === "register" && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </>
      )}

      <input
        type="email"
        name="email"
        placeholder="Adresse e-mail"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {type === "register" && (
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      )}

      <button type="submit">
        {type === "login" ? "Se connecter" : "S'inscrire"}
      </button>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
}
