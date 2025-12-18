export default function Login() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-five">
      <section className="mb-10 text-center">
        <h1>Bienvenido a tu recordatorio de activades</h1>
      </section>
      <section className="mb-10 w-4/4 text-center">
        <h2>
          Ingresa tus credenciales para comenzar a registrar tus actividades
        </h2>
      </section>
      <section>
        <form className="flex flex-col gap-6 p-10 m-6 bg-four rounded-lg ">
          <h3 className="text-center text-xl">Iniciar Sesión</h3>
          <div className="flex flex-col gap-2">
            <label htmlFor="Correo" className="text-xs">Correo Electrónico</label>
            <input type="email" id="Correo" className="bg-white rounded-md p-1 h-8 text-xs focus:outline-none focus:ring-2 focus:ring-one" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="Password" className="text-xs">Contraseña</label>
            <input type="password" id="Password" className="bg-white rounded-md p-1 h-8 text-xs focus:outline-none focus:ring-2 focus:ring-one" />
          </div>
          <span className="text-center text-xs">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-white">
              Registrate aquí
            </a>
          </span>
          <button type="submit" className="bg-one text-white p-2 rounded-md">
            Ingresar
          </button>
        </form>
      </section>
    </main>
  );
}
