"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/services/auth/auth.service";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    phone?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Correo inválido";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});
      const res = await registerUser({
        name,
        email,
        phone: "51" + phone,
        password,
      });
      login(res.token, res.user);
      if (res.token && res.user) {
        Swal.fire({
          title: "¡Registro exitoso!",
          text: "Has iniciado sesión correctamente.",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-one text-white px-4 py-2 rounded-md",
          },
        });
      }
      setTimeout(() => router.push("/home"), 2000); //redirigir a home despues de 2 segundos
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrors({
          general: error?.response?.data?.message || "Error en el registro",
        });
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message || "Error en el registro",
          icon: "error",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-one text-white px-4 py-2 rounded-md",
          },
        });
      } else {
        setErrors({
          general: "Ocurrió un error inesperado",
        });
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error inesperado",
          icon: "error",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-one text-white px-4 py-2 rounded-md",
          },
        });
      }
    } finally {
      setLoading(false);
    }
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
          {errors.general && (
            <span className="text-red-500 text-s text-center">
              {errors.general}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Input
              label="Nombre Completo"
              placeholder="Nombre completo"
              id="Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              icon={
                <Image
                  src="/icons/user.png"
                  alt="Nombre completo"
                  width={20}
                  height={20}
                />
              }
              error={errors.name}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Input
              label="Correo Electrónico"
              placeholder="Correo electrónico"
              id="Correo"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <Image
                  src="/icons/email.png"
                  alt="Correo electrónico"
                  width={20}
                  height={20}
                />
              }
              error={errors.email}
            />
            <Input
              label="Teléfono"
              placeholder="Número de teléfono"
              id="Telefono"
              type="number"
              onChange={(e) => setPhone(e.target.value)}
              icon={
                <Image
                  src="/icons/phone.png"
                  alt="Número de teléfono"
                  width={20}
                  height={20}
                />
              }
              error={errors.phone}
            />
          </div>

          <div className="flex items-center gap-2">
            <Input
              label="Contraseña"
              placeholder="Contraseña"
              id="Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={showPassword ? "/icons/hide.png" : "/icons/show.png"}
                    alt={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    width={25}
                    height={25}
                  />
                </button>
              }
              error={errors.password}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              label="Confirmar Contraseña"
              placeholder="Confirmar contraseña"
              id="ConfirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Image
                    src={
                      showConfirmPassword
                        ? "/icons/hide.png"
                        : "/icons/show.png"
                    }
                    alt={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    width={25}
                    height={25}
                  />
                </button>
              }
              error={errors.confirmPassword}
            />
          </div>
          <span className="text-center text-xs">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/" className="text-white">
              Inicia sesión aquí
            </Link>
          </span>
          <Button bg="bg-one" textColor="text-white" loading={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </Form>
      </section>
    </main>
  );
}
