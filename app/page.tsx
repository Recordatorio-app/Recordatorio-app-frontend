"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await loginUser({ email, password });
    login(res.token, res.user);
    if (res.token && res.user) {
      alert("Inicio de sesión exitoso");
      setInterval(() => router.push("/home"), 2000); //redirigir a home despues de 2 segundos
    }
  };
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-five">
      <section className="mb-10 text-center mt-10">
        <h1>Bienvenido a tu recordatorio de activades</h1>
      </section>
      <section className="mb-10 w-4/4 text-center">
        <h2>
          Ingresa tus credenciales para comenzar a registrar tus actividades
        </h2>
      </section>
      <section>
        <Form
          onSubmit={handleSubmit}
          title="Iniciar Sesión"
        >
          <Input
            label="Correo Electrónico"
            placeholder="Correo electrónico"
            id="Correo"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center justify-center gap-2">
            <Input
              label="Contraseña"
              placeholder="Contraseña"
              id="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>a</span>
          </div>
          <span className="text-center text-xs">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-white">
              Registrate aquí
            </Link>
          </span>
          <Button bg="bg-one" textColor="text-white">Iniciar Sesión</Button>
        </Form>
      </section>
    </main>
  );
}
