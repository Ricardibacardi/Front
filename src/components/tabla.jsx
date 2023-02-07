import { useState, useEffect } from 'react';
import { Space, Table, Tag, Button } from 'antd';
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
                idContrato: item.idContrato,
                nombre: item.nombre,
                documento: item.documento,
                acciones: "?",
            }
        });

        setListadoContratos(getContratos);
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
      render: (_, record) => (
        <Space size="middle">
          <a>Editar</a>
          <a>Borrar</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'left', marginLeft:16, marginTop: 16 }}>
        <Formulario></Formulario>
      </div>
      <Table columns={columns} dataSource={listadoContratos} />
    </div>
  );
}
export default Tabla;