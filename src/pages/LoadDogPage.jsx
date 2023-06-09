import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, Autocomplete, Avatar, MenuItem } from "@mui/material";
import url from "../data/url";
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url
import { razas, enfermedades } from "../data/perros";
import { Pets } from "@mui/icons-material";

function LoadDogPage() {
	// Obtiene el id del usuario que se pasa como parametro en la url
	const location = useLocation();
	const idUsuario = location.pathname.split("/")[2];
	const nombre = location.pathname.split("/")[3];
	const token = localStorage.getItem("jwt"); // Se obtiene el token del admin

	// Se declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const [enf, setEnf] = useState([]);

	function validarDatos(datos) {
		return (
			datos.get("nombre").trim() !== "" &&
			datos.get("edad").toString().trim() !== "" &&
			datos.get("raza").trim() !== "" &&
			// datos.get('caracteristicas').trim() !== '' &&
			// datos.get('enfermedad').trim() !== '' &&
			datos.get("sexo").trim() !== ""
		);
	}

	// Manejador del boton submit del formulario
	const handleSubmit = (event) => {
		event.preventDefault(); // Se elimina las acciones default del formulario
		// Almacena la informacion del formulario, currentTarget hace referencia al formulario actual
		const data = new FormData(event.currentTarget);

		// Se realiza el fetch con la BD y se manda en el cuerpo del mensaje los datos del formulario
		// Datos de los perros: ID del usuario, nombre, raza, edad, enfermedad, sexo y caracteristicas
		if (!validarDatos(data)) {
			setSnackbar({
				children: "No puede ingresar un campo vacio.",
				severity: "error",
			});
			return;
		}
		fetch(url + "perros/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
			credentials: "include",
			mode: "cors",
			body: JSON.stringify({
				idUsuario: idUsuario,
				nombre: data.get("nombre"),
				raza: data.get("raza"),
				edad: data.get("edad"),
				enfermedad: enf.toString(),
				sexo: data.get("sexo"),
				caracteristicas: data.get("caracteristicas"),
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSnackbar({
						children: "Registro exitoso.",
						severity: "success",
					});
					setTimeout(() => {
						window.location.replace(
							"/perros/usuario/" + idUsuario + "/" + nombre
						);
					}, 1000);
				} else {
					setSnackbar({
						children: "Error al conectar con la base de datos",
						severity: "error",
					});
				}
			})
			.catch((error) => {
				setSnackbar({
					children: "Error al conectar con la base de datos",
					severity: "error",
				});
				console.error(error);
			});
	};

	// Datos de los perros: ID del usuario, nombre, raza, edad, enfermedad, sexo y caracteristicas
	return (
		<Container component='main' maxWidth='xs'>
			<Box
				sx={{
					marginTop: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
					<Pets />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Registrar perro
				</Typography>

				<Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								name='nombre'
								required
								fullWidth
								id='nombre'
								label='Nombre'
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								select
								id='raza'
								label='Raza'
								name='raza'
								defaultValue={""}
							>
								{razas.map((raza) => (
									<MenuItem value={raza} key={raza}>
										{raza}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id='edad'
								label='Edad'
								name='edad'
								type='number'
								inputProps={{
									min: 0,
									max: 252,
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id='sexo'
								name='sexo'
								label='Sexo'
								select
								required
								fullWidth
							>
								<MenuItem key={"macho"} value={"Macho"}>
									Macho
								</MenuItem>
								<MenuItem key={"hembra"} value={"Hembra"}>
									Hembra
								</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								multiple
								id='enfermedad'
								value={enf}
								onChange={(event, newValue) => {
									setEnf(newValue);
								}}
								options={enfermedades}
								freeSolo
								getOptionLabel={(option) => option}
								defaultValue={[enfermedades[1]]}
								renderInput={(params) => (
									<TextField {...params} label='Enfermedades' />
								)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								name='caracteristicas'
								label='Caracteristicas'
								id='caracteristicas'
							/>
						</Grid>
					</Grid>

					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Registrar
					</Button>
					{!!snackbar && (
						<Snackbar
							open
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
							onClose={handleCloseSnackbar}
							autoHideDuration={6000}
						>
							<Alert {...snackbar} onClose={handleCloseSnackbar} />
						</Snackbar>
					)}
				</Box>
			</Box>
		</Container>
	);
}

export default LoadDogPage;
