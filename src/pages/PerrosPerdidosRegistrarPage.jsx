import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, Avatar } from "@mui/material";
import url from "../data/url";
import { useContext, useState } from "react";

import { Image, Pets, Remove } from "@mui/icons-material";
import { Context } from "../context/Context";

function LostDogsRegisterPage() {
	const { usuario } = useContext(Context);
	if (!usuario) {
		window.location.replace("/login");
	}

	const token = localStorage.getItem("jwt");

	// handleSubirImagen = () = {
	// 	fetch(url + 'perdidos/subirImagen/' + id)
	// }

	// Manejador del boton submit del formulario
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// data.append('idUsuario', usuario ? usuario.id : -1);
		// data.append('imagen', selectedImage);
		// data.append('email', usuario ? usuario.email : data.get('email'));
		// console.log(selectedImage);
		// console.log(data.get('fecha'));
		fetch(url + "perdidos/register", {
			method: "POST",
			headers: {
				// 'Content-Type': 'multipart/form-data',
				"Content-Type": "application/json",
				token: `${token}`,
			},
			credentials: "include",
			mode: "cors",
			// body: data,
			body: JSON.stringify({
				idUsuario: usuario ? usuario.id : -1,
				nombre: data.get("nombre"),
				zona: data.get("zona"),
				fecha: data.get("fecha"),
				descripcion: data.get("descripcion"),
				email: usuario ? usuario.email : data.get("email"),
				// imagen: selectedImage,
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSnackbar({
						children: "Registro exitoso.",
						severity: "success",
					});
					setTimeout(() => {
						window.location.replace("/perdidos");
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

	const hoy = new Date().toISOString().split("T")[0];
	// Variables para no permitir piquear fechas anteriores a hoy.
	const today = new Date();
	const formattedToday = today.toISOString().split("T")[0];

	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const [selectedImage, setSelectedImage] = useState(null);

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
					Registrar perro perdido
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
								id='fecha'
								label='Fecha'
								name='fecha'
								defaultValue={hoy}
								inputProps={{ max: formattedToday }}
								type='date'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name='zona'
								required
								fullWidth
								id='zona'
								label='Zona'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name='descripcion'
								required
								fullWidth
								id='descripcion'
								label='Descripción'
							/>
						</Grid>
						{!usuario && (
							<>
								<Grid item xs={12}>
									<TextField
										fullWidth
										required
										name='email'
										label='Email'
										id='email'
									/>
								</Grid>
							</>
						)}
						{selectedImage && (
							<Grid
								item
								xs={12}
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 2,
								}}
							>
								<img
									alt='foto perro perdido'
									style={{
										width: "100%",
										borderRadius: 4,
										boxShadow: "0px 3px 5px -2px",
									}}
									src={URL.createObjectURL(selectedImage)}
								/>
								<Button
									color='error'
									variant='contained'
									startIcon={<Remove />}
									onClick={() => setSelectedImage(null)}
								>
									Eliminar
								</Button>
							</Grid>
						)}
					</Grid>

					{/* <Button
						fullWidth
						color={"tertiary"}
						variant="contained"
						component="label"
						startIcon={<Image />}
						sx={{ mt: 2 }}
					>
						Subir foto
						<input
							type="file"
							hidden
							name="fotoPerro"
							onChange={(event) => {
								console.log(event.target.files[0]);
								setSelectedImage(event.target.files[0]);
							}}
						/>
					</Button> */}
					<Button sx={{ mt: 2 }} type='submit' fullWidth variant='contained'>
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

export default LostDogsRegisterPage;
