import { Context } from '../context/Context';
import { useEffect, useState, useCallback, useContext } from 'react';
import url from '../data/url';
import { DataGrid, GridActionsCellItem, GridOverlay } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Delete from '@mui/icons-material/DeleteForever';
import { razas } from '../data/perros';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import { AssignmentOutlined, CalendarMonth } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function TablaPerros(props) {
	const { usuario } = useContext(Context); // Usuario con sesion activa del que se muestran los perros
	const token = localStorage.getItem('jwt');

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === 'veterinario') {
			setEsVeterinario(true);
		}
	}, [usuario]);

	// Declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null); // Manejador del cierre de la snackbar

	const [rows, setRows] = useState([]); // Filas de la tabla de perros a mostrar

	// Asigna a las filas los perros obtenidos de la BD.
	useEffect(() => {
		obtenerPerros().then((rows) => setRows(rows));
	}, []);

	// Manejador del borrado de los perros
	async function eliminarPerro(id) {
		const response = await fetch(url + 'perros/delete/' + id, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		});
		console.log(response);
		if (response.ok) {
			setSnackbar({
				children: 'Perro eliminado con exito',
				severity: 'success',
			});
			setRows(rows.filter((row) => row.id !== id));
		} else {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
	}

	// Obtiene los perros del usuario desde la BD.
	async function obtenerPerros() {
		try {
			const response = await fetch(url + 'perros/' + props.idUsuario, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
				},
			});
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: 'No estas autorizado para ver los perros',
						severity: 'error',
					});
				}
				return [];
			}
			let perros = await response.json();
			if (perros.length == 0) {
				setSnackbar({
					children: 'La lista de perros se encuentra vacia',
					severity: 'info',
				});
			}
			return perros;
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return [];
		}
	}

	// Establece las columnas a mostrar de la tabla de perros.
	const columns = [
		// Datos de los perros: ID, nombre, raza, edad, enfermedad, sexo y caracteristicas
		{ field: 'id', headerName: 'ID', width: 50, id: 'id' },
		{
			field: 'nombre',
			headerName: 'Nombre',
			width: 150,
			id: 'nombre',
			editable: true,
		},
		{
			field: 'edad',
			headerName: 'Edad',
			width: 100,
			id: 'edad',
			type: 'number',
			editable: true,
		},
		{
			field: 'raza',
			headerName: 'Raza',
			width: 150,
			type: 'singleSelect',
			valueOptions: razas,
			editable: true,
		},
		{
			field: 'sexo',
			headerName: 'Sexo',
			width: 100,
			type: 'singleSelect',
			valueOptions: ['Masculino', 'Femenino'],
			editable: true,
		},
		{
			field: 'caracteristicas',
			headerName: 'Caracteristicas',
			width: 300,
			editable: true,
		},
	];

	// Funcion para validar los datos al modificarlos
	function validarDatos(datos) {
		return (
			datos.nombre.trim() !== '' &&
			datos.edad.toString().trim() !== '' &&
			datos.raza.trim() !== '' &&
			// datos.caracteristicas.trim() !== '' &&
			// datos.enfermedad.trim() !== '' &&
			datos.sexo.trim() !== ''
		);
	}

	// Fetch de modificacion de los datos de un perro
	const processRowUpdate = useCallback(async (newRow, oldRow) => {
		if (!validarDatos(newRow)) {
			setSnackbar({
				children: 'No puede ingresar un campo vacio.',
				severity: 'error',
			});
			return oldRow;
		}
		const response = await fetch(url + 'perros/modify/' + newRow.id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			body: JSON.stringify(newRow),
		});
		if (response.ok) {
			setSnackbar({
				children: 'Perro modificado con exito',
				severity: 'success',
			});
			return newRow;
		}
		if (response.status == 500) {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
		return oldRow;
	}, []);

	// Manejador de errores en el update (modificacion)
	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

	// Establece las acciones de cada fila y si es veterinario muestra el borrado
	columns.push({
		field: 'actions',
		headerName: '',
		width: 300,
		renderCell: (params) => {
			const { id } = params.row;

			const actions = [
				<Button
					key="turnos"
					startIcon={<CalendarMonth />}
					component={NavLink}
					to={`/turnos/perro/${id}`}
					sx={{ mr: 1, fontSize: 11 }}
				>
					Turnos
				</Button>,
				<Button
					key="historial"
					startIcon={<AssignmentOutlined />}
					component={NavLink}
					to={`/historial-clinico/${id}`}
					sx={{ fontSize: 11 }}
				>
					Historial clínico
				</Button>,
			];

			if (esVeterinario) {
				actions.push(
					<Tooltip key="delete" title="Eliminar" placement="right">
						<GridActionsCellItem
							icon={<Delete />}
							label="Delete"
							onClick={() => {
								setPerroBorrar(id);
								handleClickOpenConfirmar();
							}}
							color="primary"
							// sx={{ '&:hover': { color: 'red' } }}
						/>
					</Tooltip>
				);
			}

			return <>{actions}</>;
		},
	});

	const [openConfirmar, setOpenConfirmar] = useState(false);

	const [perroBorrar, setPerroBorrar] = useState();

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};

	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

	// Para cambiar el mensaje que muestra si no hay perros
	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay perros cargados</div>
			</GridOverlay>
		);
	};

	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				editMode="row"
				rows={rows}
				columns={columns}
				columnVisibilityModel={{
					id: usuario.rol == 'veterinario',
				}}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={handleProcessRowUpdateError}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 5 },
					},
				}}
				pageSizeOptions={[5, 10]}
				components={{
					NoRowsOverlay: CustomNoRowsOverlay,
				}}
			/>
			<Dialog
				open={openConfirmar}
				onClose={handleCloseConfirmar}
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					Estas seguro/a de <b style={{ color: 'red' }}>eliminar</b> al perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Una vez que confirmes, también se eliminarán todos los turnos
						asociados al perro.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="error"
						variant="outlined"
						onClick={handleCloseConfirmar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							eliminarPerro(perroBorrar);
							handleCloseConfirmar();
						}}
						autoFocus
					>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
			{!!snackbar && (
				// Declaracion de propiedades de la snackbar
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={6000}
				>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
		</div>
	);
}

export default TablaPerros;
