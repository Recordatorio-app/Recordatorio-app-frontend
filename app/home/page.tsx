"use client";

import Banner from "@/components/home/banner";
import Card from "@/components/home/card";
import Pagination from "@/components/home/pagination";
import Button from "@/components/ui/button";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Task } from "@/models/Task/task_response_dto";
import { ColorPalette } from "@/models/User/user_response_dto";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "@/services/task/task.service";
import {
  getUserPalette,
  updateUserPalette,
} from "@/services/user/user.service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default function Home() {
  const { user } = useAuth();
  const { palette, setPalette } = useTheme();

  const [page, setPage] = useState(1);
  const [pageCompleted, setPageCompleted] = useState(1);

  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);

  const [pendingTasksList, setPendingTasksList] = useState<Task[]>([]);
  const [completedTasksList, setCompletedTasksList] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  //Estado para el modal de crear actividad
  const [open, setOpen] = useState(false);

  //Estado para el modal de editar actividad
  const [modalEditOpen, setModalEditOpen] = useState(false);

  //Estado para el modal de editar colores
  const [modalEditColorsOpen, setModalEditColorsOpen] = useState(false);

  //Campos para los inputs de la actividad
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityDeadline, setActivityDeadline] = useState("");
  const [activityDeadlineTime, setActivityDeadlineTime] = useState("");
  const [activityImportance, setActivityImportance] = useState("");
  const [activityStatus, setActivityStatus] = useState("");

  const [editablePalette, setEditablePalette] = useState<ColorPalette | null>(
    null
  );

  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

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
    const fetchTasks = async () => {
      const [pendingRes, completedRes] = await Promise.all([
        getTasks(page, 4, "pendiente"),
        getTasks(pageCompleted, 4, "realizada"),
      ]);

      setPendingTasksList(pendingRes.data);
      setCompletedTasksList(completedRes.data);

      setPendingTasks(pendingRes.stats.pendientes);
      setCompletedTasks(completedRes.stats.realizadas);

      setPendingTotalPages(pendingRes.pagination.totalPages);
      setCompletedTotalPages(completedRes.pagination.totalPages);
    };

    const fetchPalette = async () => {
      try {
        const res = await getUserPalette(user?.id || "");
        setEditablePalette(res);
      } catch (error) {
        console.log("error obteniendo la paleta:", error);
      }
    };
    fetchPalette();

    fetchTasks();
  }, [page, pageCompleted, user]);

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const body = {
      title: activityName,
      description: activityDescription,
      status: activityStatus,
      reminderDate: new Date(
        activityDeadline + " " + activityDeadlineTime
      ).toISOString(),
      colorKey: activityImportance,
    };
    try {
      setLoading(true);
      setErrors({});

      const res = await createTask(body);

      if (res) {
        Swal.fire({
          title: "¡Actividad creada con éxito!",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-one text-white px-4 py-2 rounded-md",
          },
        });
        const update = await getTasks(page, 4, "pendiente");
        setPendingTasksList(update.data);
        setPendingTotalPages(update.pagination.totalPages);
        setPendingTasks(update.stats.pendientes);
      }
    } catch (error) {
      console.error("Error creando tarea", error);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al crear la actividad",
        icon: "error",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-one text-white px-4 py-2 rounded-md",
        },
      });
    }

    setLoading(false);
    setOpen(false);
    setActivityName("");
    setActivityDescription("");
    setActivityDeadline("");
    setActivityDeadlineTime("");
    setActivityImportance("");
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
      const res = await updateTask(selectedTask?._id || "", body);
      setLoading(true);
      if (res) {
        const update = await getTasks(page, 4, "pendiente");
        const updateCompleted = await getTasks(pageCompleted, 4, "realizada");

        setPendingTasksList(update.data);
        setCompletedTasksList(updateCompleted.data);

        setPendingTotalPages(update.pagination.totalPages);
        setCompletedTotalPages(updateCompleted.pagination.totalPages);

        setPendingTasks(update.stats.pendientes);
        setCompletedTasks(updateCompleted.stats.realizadas);

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
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al editar la actividad",
        icon: "error",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-one text-white px-4 py-2 rounded-md",
        },
      });
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
  const handlePalette = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateUserPalette(
        user?.id || "",
        editablePalette || {}
      );
      setPalette(res);
      setEditablePalette(res);

      Swal.fire({
        title: "¡Paleta de colores actualizada con éxito!",
        icon: "success",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-one text-white px-4 py-2 rounded-md",
        },
      });
      setLoading(false);
      setModalEditColorsOpen(false);
    } catch (error) {
      console.log("error:", error);
    }
  };
  const handlePaletteChange = (key: keyof ColorPalette, value: string) => {
    setEditablePalette((prev) => (prev ? { ...prev, [key]: value } : prev));
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
      const body = {
        title: task?.title || "",
        description: task?.description || "",
        status: "realizada",
        reminderDate: task?.reminderDate || "",
        colorKey: task?.colorKey || "",
      };

      await updateTask(taskId, body);

      // refrescar listas
      const [pending, completed] = await Promise.all([
        getTasks(page, 4, "pendiente"),
        getTasks(pageCompleted, 4, "realizada"),
      ]);

      setPendingTasksList(pending.data);
      setCompletedTasksList(completed.data);

      setPendingTasks(pending.stats.pendientes);
      setCompletedTasks(completed.stats.realizadas);

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
        cancelButton: "bg-four text-black px-4 py-2 rounded-md ",
      },
    });
    if (!response.isConfirmed) return;

    const res = await deleteTask(taskId);

    const update = await getTasks(page, 4, "pendiente");
    setPendingTasksList(update.data);
    setPendingTotalPages(update.pagination.totalPages);
    setPendingTasks(update.stats.pendientes);

    const updateCompleted = await getTasks(pageCompleted, 4, "realizada");
    setCompletedTasksList(updateCompleted.data);
    setCompletedTotalPages(updateCompleted.pagination.totalPages);
    setCompletedTasks(updateCompleted.stats.realizadas);

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

  if (!palette) return null;

  return (
    <main>
      <section className="flex flex-col items-center justify-center w-3/4 m-auto ">
        <h1 className="text-center text-2xl mt-10">
          Bienvenido {user ? user.name : "Usuario"} al recordatorio de
          actividades
        </h1>
        <Button
          bg="bg-four flex items-center gap-2 mt-5"
          textColor="text-black"
          type="button"
          onClick={async () => {
            const response = await Swal.fire({
              title: "¿Deseas cerrar sesión?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Sí",
              cancelButtonText: "No",
              buttonsStyling: false,
              customClass: {
                confirmButton: "bg-one text-white px-4 py-2 rounded-md mr-2",
                cancelButton: "bg-four text-black px-4 py-2 rounded-md",
              },
            });
            if (response.isConfirmed) {
              Swal.fire({ 
                title: "¡Sesión cerrada exitosamente!",
                icon: "success",
                buttonsStyling: false,
                customClass: {
                  confirmButton: "bg-one text-white px-4 py-2 rounded-md",
                },
              });
              localStorage.removeItem("token");
              router.push("/");
            } 
          }}
        >
          Cerrar Sesión{" "}
          <Image
            src={"/icons/logout.png"}
            alt="Cerrar sesión"
            width={"20"}
            height={"20"}
          />
        </Button>
      </section>

      <section className="flex flex-col items-center justify-center mt-10 w-full ">
        <div className="flex flex-col items-center flex-1 w-full gap-4 mb-10">
          <p className="text-center text-lg">Colores para las actividades</p>
          <Button
            bg="bg-four flex items-center gap-2"
            textColor="text-black"
            type="button"
            onClick={() => setModalEditColorsOpen(true)}
          >
            Editar Colores
            <Image
              src={"/icons/edit.png"}
              alt="Editar colores "
              width={"20"}
              height={"20"}
            />
          </Button>
          <ul className="flex flex-row flex-wrap justify-center gap-2 mt-3">
            <li className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette.urgente }}
              />
              <span>Urgente</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette.importante }}
              />
              <span>Importante</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette.normal }}
              />
              <span>Normal</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette.baja }}
              />
              <span>Baja</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette.personal }}
              />
              <span>Personal</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette.otro }}
              />
              <span>Otro</span>
            </li>
          </ul>
        </div>
        {/* Card Section */}
        <div className="flex flex-col items-center  flex-1 w-full gap-4 mb-10">
          <Button
            type="button"
            bg="bg-four flex items-center gap-2"
            textColor="text-black"
            onClick={() => setOpen(true)}
          >
            Crear Actividad
            <Image
              src={"/icons/add.png"}
              alt="Crear actividad"
              width={"25"}
              height={"25"}
            />
          </Button>
          <div className="mt-5 flex flex-row gap-5 m-4">
            <div className="flex flex-col items-center bg-four p-4 rounded-lg shadow-md">
              <h2 className="text-sm font-semibold">ACTIVIDADES PENDIENTES</h2>
              <p className="text-2xl mt-5">{pendingTasks}</p>
            </div>
            <div className="flex flex-col text-white items-center bg-one p-4 rounded-lg shadow-md">
              <h2 className="text-sm font-semibold">ACTIVIDADES REALIZADAS</h2>
              <p className="text-2xl mt-5">{completedTasks}</p>
            </div>
          </div>
        </div>
        {/* Banner Section */}
      </section>
      <Banner
        title={"Actividades pendientes" + " (" + pendingTasks + ")"}
        color="bg-one"
        textColor="text-white"
      />
      <div className="mt-5 grid grid-cols-1 gap-5 m-4">
        {pendingTasks === 0 && (
          <p className="text-center font-semibold">
            No hay actividades pendientes
          </p>
        )}
        {pendingTasksList.map((task) => (
          <Card
            key={task._id}
            idTask={task._id}
            title={task.title}
            fecha={new Date(task.reminderDate).toLocaleDateString()}
            hora={new Date(task.reminderDate).toLocaleTimeString()}
            descripcion={task.description}
            color={
              task.colorKey
                ? palette[task.colorKey as keyof typeof palette]
                : "gray"
            }
            onEdit={() => openEditModal(task)}
            onDelete={() => deleteTaskHandler(task._id || "")}
            onComplete={() => completedTask(task._id || "")}
          />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={pendingTotalPages}
        onPageChange={setPage}
      />
      <Banner
        title={"Actividades realizadas" + " (" + completedTasks + ")"}
        color="bg-two"
        textColor="text-white"
      />
      <div className="mt-5 grid grid-cols-1 gap-5 m-4">
        {completedTasks === 0 && (
          <p className="text-center font-semibold">
            No hay actividades realizadas
          </p>
        )}
        {completedTasksList.map((task) => (
          <Card
            key={task._id}
            idTask={task._id}
            title={task.title}
            fecha={new Date(task.reminderDate).toLocaleDateString()}
            hora={new Date(task.reminderDate).toLocaleTimeString()}
            descripcion={task.description}
            color={
              task.colorKey
                ? palette[task.colorKey as keyof typeof palette]
                : "gray"
            }
            onEdit={() => openEditModal(task)}
            onComplete={() => completedTask(task._id || "")}
            onDelete={() => deleteTaskHandler(task._id || "")}
          />
        ))}
      </div>
      <Pagination
        currentPage={pageCompleted}
        totalPages={completedTotalPages}
        onPageChange={setPageCompleted}
      />
      {/* Modal para crear la actividad*/}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Agregar Actividad"
      >
        <Form onSubmit={handleSubmit} style="flex flex-col gap-6  rounded-lg">
          {errors.general && (
            <span className="text-red-500 text-s text-center">
              {errors.general}
            </span>
          )}
          <Input
            label="Nombre de la Actividad"
            placeholder="Nombre de la Actividad"
            id="activityName"
            type="text"
            onChange={(e) => setActivityName(e.target.value)}
            icon={undefined}
            error={errors.activityName}
          />
          <Input
            label="Descripción de la Actividad"
            placeholder="Descripción de la Actividad"
            id="activityDescription"
            as="textarea"
            className="bg-white rounded-md p-2 text-xs w-full h-24 focus:outline-none focus:ring-2 focus:ring-one"
            onChange={(e) => setActivityDescription(e.target.value)}
            icon={undefined}
            error={errors.activityDescription}
          />
          <div className="flex gap-2 items-center">
            <Input
              label="Fecha límite de la Actividad"
              placeholder="Fecha límite de la Actividad"
              id="activityDeadline"
              type="date"
              onChange={(e) => setActivityDeadline(e.target.value)}
              error={errors.activityDeadline}
            />
            <Input
              label="Hora límite de la Actividad"
              placeholder="Hora límite de la Actividad"
              id="activityDeadlineTime"
              type="time"
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
            onChange={(e) => setActivityImportance(e.target.value)}
            error={errors.activityImportance}
          />
          <div className="flex gap-2 justify-center">
            <Button
              bg="bg-two"
              textColor="text-white "
              onClick={() => {
                setOpen(false);
                setErrors({});
              }}
            >
              Cancelar
            </Button>
            <Button bg="bg-one" textColor="text-white" loading={loading}>
              {loading ? "Creando..." : "Crear Actividad"}
            </Button>
          </div>
        </Form>
      </Modal>
      {/*Modal para editar una actividad */}
      <Modal
        isOpen={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        title="Editar Actividad"
      >
        <Form
          onSubmit={handleEditSubmit}
          style="flex flex-col gap-5 rounded-lg"
        >
          {errors.general && (
            <span className="text-red-500 text-s text-center">
              {errors.general}
            </span>
          )}
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
              type="date"
              value={activityDeadline}
              onChange={(e) => setActivityDeadline(e.target.value)}
              error={errors.activityDeadline}
            />
            <Input
              label="Hora límite de la Actividad"
              placeholder="Hora límite de la Actividad"
              id="activityDeadlineTime"
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
      {/* Modal para editar los colores de importancia*/}
      <Modal
        isOpen={modalEditColorsOpen}
        onClose={() => setModalEditColorsOpen(false)}
        title="Editar Colores de Importancia"
      >
        <Form onSubmit={handlePalette} style="flex flex-col gap-6  rounded-lg">
          <div className="grid grid-cols-3  gap-3">
            <Input
              label="Color para las actividades Urgentes"
              id="colorUrgente"
              type="color"
              className="bg-white p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-one"
              value={editablePalette?.urgente}
              onChange={(e) => handlePaletteChange("urgente", e.target.value)}
            />
            <Input
              label="Color para las actividades Importantes"
              id="colorImportante"
              type="color"
              className="bg-white p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-one"
              value={editablePalette?.importante}
              onChange={(e) =>
                handlePaletteChange("importante", e.target.value)
              }
            />
            <Input
              label="Color para las actividades Normales"
              id="colorNormal"
              type="color"
              className="bg-white p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-one"
              value={editablePalette?.normal}
              onChange={(e) => handlePaletteChange("normal", e.target.value)}
            />
            <Input
              label="Color para las actividades Bajas"
              id="colorBaja"
              type="color"
              className="bg-white p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-one"
              value={editablePalette?.baja}
              onChange={(e) => handlePaletteChange("baja", e.target.value)}
            />
            <Input
              label="Color para las actividades Personales"
              id="colorPersonal"
              type="color"
              className="bg-white p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-one"
              value={editablePalette?.personal}
              onChange={(e) => handlePaletteChange("personal", e.target.value)}
            />
            <Input
              label="Color para las actividades Otro"
              id="colorOtro"
              type="color"
              className="bg-white p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-one"
              value={editablePalette?.otro}
              onChange={(e) => handlePaletteChange("otro", e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              bg="bg-two"
              textColor="text-white "
              onClick={() => setModalEditColorsOpen(false)}
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
