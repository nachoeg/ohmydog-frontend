import { Container } from "@mui/material";
import TablaPerros from "../components/TablaPerros";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function AllDogsPage() {
	return (
		<Container
			component='main'
			maxWidth='lg'
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				mt: 4,
			}}
		>
			<TablaPerros idUsuario={""} />
			<Button
				key='perrosBorrados'
				component={NavLink}
				to={`/perrosBorrados/`}
				color='tertiary'
				variant='contained'
				fullWidth
			>
				Perros borrados
			</Button>
		</Container>
	);
}

export default AllDogsPage;
