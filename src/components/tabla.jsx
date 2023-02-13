import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import Formulario from '../components/formulario.jsx';

export const Tabla = ({

}) => {

    const [listadoContratos, setListadoContratos] = useState([]);
    const [cargando, setCargando] = useState(false);

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
      render: (datos, da) => (
        <div className="action-buttons">
            <Button onClick={() => borrarContrato(datos._id)} icon={<DeleteOutlined />} type="danger" >Borrar</Button>
        </div>
    ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'left', marginLeft:16, marginTop: 16 }}>
        <Formulario></Formulario>
      </div>
      <Table columns={columns} dataSource={listadoContratos} getListadoContratos={getListadoContratos()} />
    </div>
  );
}
export default Tabla;