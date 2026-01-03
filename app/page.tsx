"use client";

import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth/auth.service";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      const res = await loginUser({ email, password });

      login(res.token, res.user);
      Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        text: 'Has iniciado sesión correctamente.',
        icon: 'success',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-one text-white px-4 py-2 rounded-md',
        },
      })
      router.push("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrors({
          general: error?.response?.data?.message || "Credenciales incorrectas",
        });
        Swal.fire({
          title: 'Error',
          text: error?.response?.data?.message || "Credenciales incorrectas",
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-one text-white px-4 py-2 rounded-md',
          },
        })

      } else {
        setErrors({
          general: "Ocurrió un error inesperado",
        });
        Swal.fire({
          title: 'Error',
          text: "Ocurrió un error inesperado",
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-one text-white px-4 py-2 rounded-md',
          },
        })
      }
    } finally {
      setLoading(false);
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

          <div className="flex items-center gap-2">
            <Input
              label="Correo Electrónico"
              placeholder="Correo electrónico"
              id="Email"
              type="text"
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
          <span className="text-center text-xs mt-4">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-white">
              Registrate aquí
            </Link>
          </span>
          <Button bg="bg-one" textColor="text-white" loading={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </Form>
      </section>
    </main>
  );
}
