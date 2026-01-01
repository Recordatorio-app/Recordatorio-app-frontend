"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/services/auth/auth.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    e.preventDefault();

    const res = await registerUser({ name, email, phone, password });
    login(res.token, res.user);
    if (res.token && res.user) {
      alert("Registro exitoso");
    }
    setInterval(() => router.push("/home"), 2000); //redirigir a home despues de 2 segundos
  };
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-two">
      <section className="mb-10 text-center text-white mt-20">
        <h1>Bienvenido al registro para tu recordatorio de actividades</h1>
      </section>
      <section className="mb-10 w-4/4 text-center text-white">
        <h2>Registrate para comenzar a crear tus recordatorios</h2>
      </section>
      <section>
        <Form onSubmit={handleSubmit} title="Registrarse">
          <Input
            label="Nombre Completo"
            placeholder="Nombre completo"
            id="Nombre"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            <Input
              label="Correo Electrónico"
              placeholder="Correo electrónico"
              id="Correo"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Teléfono"
              placeholder="Número de teléfono"
              id="Telefono"
              type="number"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

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
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                label="Confirmar Contraseña"
                placeholder="Contraseña"
                id="ConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                bg="bg-transparent absolute right-2 top-2/2 -translate-y-2/2"
                textColor="text-black"
              >
                {showConfirmPassword ? (
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
            ¿Ya tienes una cuenta?{" "}
            <Link href="/" className="text-white">
              Inicia sesión aquí
            </Link>
          </span>
          <Button bg="bg-one" textColor="text-white">
            Registrarse
          </Button>
        </Form>
      </section>
    </main>
  );
}
