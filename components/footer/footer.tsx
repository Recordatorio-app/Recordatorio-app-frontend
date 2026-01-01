const Footer = () => {
  return (
    <footer className="w-full bg-one mt-10 border-t text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center justify-between gap-4">
        {/* Marca */}
        <p className="text-sm  text-center md:text-left">
          © {new Date().getFullYear()} Recordatorio de Actividades -
          Desarrollado por{" "}
          <a href="http://joao.dev" target="_blank" rel="noopener noreferrer" className="underline">
            Joao.dev
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
