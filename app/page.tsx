"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth/auth.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      <section className="mb-10 text-center mt-10 w-3/4">
        <h1>Bienvenido a tu recordatorio de activades</h1>
      </section>
      <section className="mb-10 w-3/4 text-center">
        <h2>
          Ingresa tus credenciales para comenzar a registrar tus actividades
        </h2>
      </section>
      <section>
        <Form onSubmit={handleSubmit} title="Iniciar Sesión">
          <Input
            label="Correo Electrónico"
            placeholder="Correo electrónico"
            id="Correo"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                label="Contraseña"
                placeholder="Contraseña"
                id="Password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                bg="bg-transparent absolute right-2 top-2/2 -translate-y-2/2"
                textColor="text-black"
              >
                {showPassword ? (
                  <Image
                    src="/icons/hide.png"
                    alt="Ocultar contraseña"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src="/icons/show.png"
                    alt="Mostrar contraseña"
                    width={20}
                    height={20}
                  />
                )}
              </Button>
            </div>
          </div>
          <span className="text-center text-xs">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-white">
              Registrate aquí
            </Link>
          </span>
          <Button bg="bg-one" textColor="text-white">
            Iniciar Sesión
          </Button>
        </Form>
      </section>
    </main>
  );
}
