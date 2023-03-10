import { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { DeleteOutlined,EditOutlined } from "@ant-design/icons";
import Formulario from '../components/formulario.jsx';

export const Tabla = ({

}) => {

    const [ listadoContratos, setListadoContratos] = useState([]);
    const [ modalText, setModalText] = useState('Nuevo contrato');
    const [ open, setOpen] = useState(false);
    const [ defaultFormulario, setDefaultFormulario] = useState({
      nombre: "",
      apellido1: "",
      apellido2: "",
      telefono: "",
      documento: "",
      email: "",
      cp: "",
      localidad: "",
      direccion: ""
    });

    useEffect(() => {
      getListadoContratos();
  }, []);

    async function getListadoContratos() {
      try {
        const respuesta = await fetch('http://localhost:8000/listcontracts');
        const contratos = await respuesta.json();
        const getContratos = contratos.map(item => {
             return {
                idContrato: Number(item.idContrato),
                nombre: item.nombre,
                documento: item.documento,
                _id:item._id,
                acciones: "?",
            }
        });
console.log("tu puta madre");
        setListadoContratos(getContratos);
    } catch (err) {
        console.log("Error al obtener los contratos");
    }
  }

  async function borrarContrato(oid) {
    try {
      await fetch('http://localhost:8000/deletecontract/'+oid, {
      method: 'DELETE'
      }).then((response) => {
          if (response.ok) {
            getListadoContratos();
          } else {
              throw new Error('Error al borrar el contrato');
          }
      });

  } catch (err) {
      console.log("Error al obtener los contratos");
  }
}

async function getContrato(oid) {
    try {
      const respuesta = await fetch('http://localhost:8000/getcontract/'+oid);
      const contratos = await respuesta.json();
      setDefaultFormulario(contratos);
      setModalText("Editando contrato nº "+contratos.idContrato)
      setOpen(true);
  } catch (err) {
      console.log("Error al obtener el contrato");
  }
}

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idContrato',
      key: 'idContrato',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Documento',
      dataIndex: 'documento',
      key: 'documento',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (datos) => (
        <div>
            <Space wrap>
              <Button onClick={() => getContrato(datos._id)} icon={<EditOutlined />} type="primary" >Editar</Button>
              <Button onClick={() => borrarContrato(datos._id)} icon={<DeleteOutlined />} type="primary" danger>Borrar</Button>
            </Space>
        </div>
    ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'left', marginLeft:16, marginTop: 16 }}>
        <Formulario 
          defaultFormulario={defaultFormulario} 
          setDefaultFormulario={setDefaultFormulario} 
          open={open} 
          setOpen={setOpen}
          modalText={modalText}
          setModalText={setModalText}
          getListadoContratos={getListadoContratos}
        ></Formulario>
      </div>
      <Table columns={columns} dataSource={listadoContratos} open={open} setOpen={setOpen}/>
    </div>
  );
}
export default Tabla;