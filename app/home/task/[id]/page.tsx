"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteTask,
  getTaskById,
  updateTask,
} from "@/services/task/task.service";
import { Task } from "@/models/Task/task_response_dto";
import Banner from "@/components/home/banner";
import Link from "next/link";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);

  //Campos para los inputs de la actividad
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityDeadline, setActivityDeadline] = useState("");
  const [activityDeadlineTime, setActivityDeadlineTime] = useState("");
  const [activityImportance, setActivityImportance] = useState("");
  const [activityStatus, setActivityStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const [errors, setErrors] = useState<{
    activityName?: string;
    activityDescription?: string;
    activityDeadline?: string;
    activityDeadlineTime?: string;
    activityImportance?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getTaskById(id as string).then(setTask);
  }, [id]);
  
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!activityName.trim()) {
      newErrors.activityName = "El nombre de la actividad es obligatorio";
    }

    if (!activityDescription.trim()) {
      newErrors.activityDescription =
        "La descripción de la actividad es obligatoria";
    }

    if (!activityDeadline.trim()) {
      newErrors.activityDeadline = "La fecha límite es obligatoria";
    }

    if (!activityDeadlineTime.trim()) {
      newErrors.activityDeadlineTime = "La hora límite es obligatoria";
    }
    if (!activityImportance.trim()) {
      newErrors.activityImportance =
        "La importancia de la actividad es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const body = {
        title: activityName,
        description: activityDescription,
        status: activityStatus,
        reminderDate: new Date(
          activityDeadline + " " + activityDeadlineTime
        ).toISOString(),
        colorKey: activityImportance,
      };
      setLoading(true);
      const res = await updateTask(selectedTask?._id || "", body);

      if (res) {
        const update = await getTaskById(selectedTask?._id || "");

        setTask(update);

        Swal.fire({
          title: "¡Actividad editada con éxito!",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-one text-white px-4 py-2 rounded-md",
          },
        });
      }
    } catch (error) {
      console.error("Error editando tarea", error);
      setLoading(false);
    }

    setLoading(false);
    setModalEditOpen(false);
    setActivityName("");
    setActivityDescription("");
    setActivityDeadline("");
    setActivityDeadlineTime("");
    setActivityImportance("");
  };
  const openEditModal = (task: Task) => {
    setSelectedTask(task);

    setActivityName(task.title);

    setActivityStatus(task.status);

    setActivityDescription(task.description);

    const date = new Date(task.reminderDate);

    setActivityDeadline(date.toISOString().split("T")[0]);

    setActivityDeadlineTime(date.toTimeString().split(" ")[0].slice(0, 5));
    setActivityImportance(task.colorKey || "");

    setModalEditOpen(true);
  };
  const completedTask = async (taskId: string) => {
    try {
      const task = await getTaskById(taskId);
      console.log("data: ", task);

      setSelectedTask(task);

      if (task?.status === "realizada") {
        Swal.fire({
          title: "La actividad ya está marcada como realizada",
          icon: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-one text-white px-4 py-2 rounded-md",
          },
        });
        return;
      }
      const response = await Swal.fire({
        title: "¿Estás seguro de que deseas completar esta actividad?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, completar",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-one text-white px-4 py-2 rounded-md mr-2",
          cancelButton: "bg-four text-black px-4 py-2 rounded-md",
        },
      });
      if (!response.isConfirmed) return;
      const body = {
        title: task?.title || "",
        description: task?.description || "",
        status: "realizada",
        reminderDate: task?.reminderDate || "",
        colorKey: task?.colorKey || "",
      };

      await updateTask(taskId, body);
      await getTaskById(taskId).then(setTask);
      Swal.fire({
        title: "¡Actividad marcada como realizada!",
        icon: "success",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-one text-white px-4 py-2 rounded-md",
        },
      });
    } catch (error) {
      console.error("Error actualizando tarea", error);
    }
  };
  const deleteTaskHandler = async (taskId: string) => {
    const response = await Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta actividad?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-one text-white px-4 py-2 rounded-md mr-2",
        cancelButton: "bg-four text-black px-4 py-2 rounded-md",
      },
    });
    if (!response.isConfirmed) return;

    const res = await deleteTask(taskId);

    if (res) {
      Swal.fire({
        title: "¡Actividad eliminada con éxito!",
        icon: "success",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-one text-white px-4 py-2 rounded-md",
        },
      });
      router.push("/home");
    }
  };
  if (!task) return <div>Cargando...</div>;

  return (
    <main className="flex flex-col items-center lg:mb-50">
      <Banner
        title={"Actividad: " + task.title}
        color="bg-one"
        textColor="text-white"
      />
      <section className="bg-three p-4 rounded-md shadow-md w-3/4 mt-10 mb-15 text-white max-w-screen-sm">
        <h2>Descripción de la actividad</h2>
        <p>{task.description}</p>
      </section>
      <section className="flex flex-row items-center gap-4 w-3/4 justify-center mb-10 max-w-screen-sm">
        <div className="bg-two p-4 rounded-md shadow-md w-3/4 mb-10 text-white">
          <p>
            Fecha de recordatorio:{" "}
            {new Date(task.reminderDate).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-four p-4 rounded-md shadow-md w-3/4 mb-10 text-white max-w-screen-sm">
          <p>
            Hora de recordatorio:{" "}
            {new Date(task.reminderDate).toLocaleTimeString()}
          </p>
        </div>
      </section>
      <section className="bg-one p-4 text-s rounded-xl shadow-md w-3/4 mb-15 text-white flex text-center max-w-screen-sm">
        <p>
          Estado de la actividad{" "}
          <span className="font-bold ">{task.status}</span>
        </p>
      </section>
      <section className="bg-one p-4 text-s rounded-xl shadow-md w-3/4 mb-15 text-white flex justify-center max-w-screen-sm">
        <p>
          Importancia <span className="font-bold">{task.colorKey}</span>
        </p>
      </section>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 m-4 ">
        <Button
          type="button"
          bg="bg-four shadow-md"
          textColor="text-black"
          onClick={() => openEditModal(task)}
        >
          Editar Actividad
        </Button>
        <Button
          type="button"
          bg="bg-four shadow-md"
          textColor="text-black"
          onClick={() => completedTask(task._id || "")}
        >
          Completar Actividad
        </Button>
        <Button
          type="button"
          bg="bg-four shadow-md"
          textColor="text-black"
          onClick={() => deleteTaskHandler(task._id || "")}
        >
          Eliminar Actividad
        </Button>
        <Button type="button" bg="bg-four shadow-md" textColor="text-black">
          <Link href="/home">Volver</Link>
        </Button>
      </section>
      {/* Modal de editar actividad */}
      <Modal
        isOpen={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        title="Editar Actividad"
      >
        <Form
          onSubmit={handleEditSubmit}
          style="flex flex-col gap-6  rounded-lg"
        >
          <Input
            label="Nombre de la Actividad"
            placeholder="Nombre de la Actividad"
            id="activityName"
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            error={errors.activityName}
          />
          <Input
            label="Descripción de la Actividad"
            placeholder="Descripción de la Actividad"
            id="activityDescription"
            as="textarea"
            className="bg-white rounded-md p-2 text-xs w-full h-24 focus:outline-none focus:ring-2 focus:ring-one"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            error={errors.activityDescription}
          />
          <Input
            label="Estado de la Actividad"
            placeholder="Estado de la Actividad"
            id="activityStatus"
            as="select"
            options={[
              { label: "Pendiente", value: "pendiente" },
              { label: "Realizada", value: "realizada" },
            ]}
            value={activityStatus}
            onChange={(e) => setActivityStatus(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <Input
              label="Fecha límite de la Actividad"
              placeholder="Fecha límite de la Actividad"
              id="activityDeadline"
              className="bg-white rounded-md p-2 text-xs  w-full focus:outline-none focus:ring-2 focus:ring-one"
              type="date"
              value={activityDeadline}
              onChange={(e) => setActivityDeadline(e.target.value)}
              error={errors.activityDeadline}
            />
            <Input
              label="Hora límite de la Actividad"
              placeholder="Hora límite de la Actividad"
              id="activityDeadlineTime"
              className="bg-white rounded-md p-2 text-xs  w-full focus:outline-none focus:ring-2 focus:ring-one"
              type="time"
              value={activityDeadlineTime}
              onChange={(e) => setActivityDeadlineTime(e.target.value)}
              error={errors.activityDeadlineTime}
            />
          </div>

          <Input
            label="Importancia de la Actividad"
            placeholder="Importancia de la Actividad"
            id="activityImportance"
            as="select"
            options={[
              { label: "Urgente", value: "urgente" },
              { label: "Importante", value: "importante" },
              { label: "Normal", value: "normal" },
              { label: "Baja", value: "baja" },
              { label: "Personal", value: "personal" },
              { label: "Otro", value: "otro" },
            ]}
            value={activityImportance}
            onChange={(e) => setActivityImportance(e.target.value)}
          />
          <div className="flex gap-2 justify-center">
            <Button
              bg="bg-two"
              textColor="text-white "
              onClick={() => setModalEditOpen(false)}
            >
              Cancelar
            </Button>
            <Button bg="bg-one" textColor="text-white" loading={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </Form>
      </Modal>
    </main>
  );
}
