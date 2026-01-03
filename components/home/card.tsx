import Image from "next/image";
import Button from "../ui/button";
import { useRouter } from "next/navigation";

interface CardProps {
  idTask?: string;
  title: string;
  fecha: string;
  hora: string;
  descripcion: string;
  color: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

const Card = ({
  idTask,
  title,
  fecha,
  hora,
  descripcion,
  color,
  onEdit,
  onDelete,
  onComplete,
}: CardProps) => {
  const router = useRouter();
  return (
    <div className="flex w-full max-w-md bg-five rounded-lg shadow-md">
      {/* Línea de color */}
      <div className="w-2" style={{ backgroundColor: color }} />

      {/* Contenido */}
      <div className="flex flex-col p-4 flex-1 gap-2 line-clamp-2">
        <h3 className="text-lg font-semibold text-center truncate">{title}</h3>
        <div className="grid grid-cols-2 gap-8 m-auto max-w-50">
          <p className="text-sm text-black">Fecha limite: {fecha}</p>
          <p className="text-sm text-black">Hora limite: {hora}</p>
        </div>

        <p className="text-xs mt-2 w-full max-h-50 truncate mb-2">{descripcion}</p>

        {/* Botones */}
        <div className="grid grid-cols-2 m-auto gap-2 w-30 ">
          <Button
            type="button"
            bg="bg-four w-3/4"
            textColor="text-black"
            onClick={() => router.push(`home/task/${idTask}`)}
          >
            <Image
              src={"/icons/view.png"}
              alt="Ver Actividad"
              width={"25"}
              height={"25"}
            />
          </Button>
          <Button
            type="button"
            bg="bg-four w-3/4"
            textColor="text-white"
            onClick={onComplete}
          >
            <Image
              src={"/icons/checked.png"}
              alt="Compartir Actividad"
              width={"25"}
              height={"25"}
            />
          </Button>
          <Button
            type="button"
            bg="bg-four w-3/4"
            textColor="text-black"
            onClick={onEdit}
          >
            <Image
              src={"/icons/edit.png"}
              alt="Editar Actividad"
              width={"25"}
              height={"25"}
            />
          </Button>
          <Button
            type="button"
            bg="bg-four w-3/4"
            textColor="text-white"
            onClick={onDelete}
          >
            <Image
              src={"/icons/trash.png"}
              alt="Eliminar Actividad"
              width={"25"}
              height={"25"}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
