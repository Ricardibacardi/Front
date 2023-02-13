import { Button, Modal, Form, Input, Space } from 'antd';
import { useState } from 'react';
import { ValidateSpanishID } from '../js/validateDni.js'

export const Formulario = ({
    defaultFormulario,
    setDefaultFormulario,
    getListadoContratos,
    open,
    setOpen
}) => {

  const [modalText, setModalText] = useState('');
  const [validarApellido, setValidarApellido] = useState(false);
  const [ textLocalidad, setTextLocalidad ] = useState('');

  const showModal = () => {
    setDefaultFormulario({});
    setOpen(true);
  };

  async function onFinish (values) {
    let method = "";
    let url = "";
    let datos = "";
    let as = {};

    if(typeof defaultFormulario?._id !== 'undefined' ){
        let oid = defaultFormulario?._id;
        method = "PUT";
        url = "http://localhost:8000/modifycontract/"+oid;
        datos = JSON.stringify(values)

    }else{
        method = "POST";
        url = "http://localhost:8000/addcontract";
        values.localidad = textLocalidad;
        datos = JSON.stringify(values)
    }
    setOpen(false)

    try {

        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: datos
        };
        
        fetch(url, requestOptions)
            .then(response => response.json())
            getListadoContratos()
        
    } catch (err) {
        console.log(err);
    }

  };

  async function getCodigoPostal (values) {
    setTextLocalidad("");
    
    try {
        
        let response = await fetch('http://localhost:8000/getlocalidad/'+values)
        const data = await response.json();
        setTextLocalidad(data.municipio_nombre)

        
    } catch (err) {
        setTextLocalidad("")
        console.log(err);
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
        <Button type="primary" onClick={showModal}>
            Nuevo
        </Button>
        <Modal
            title=""
            open={open}
            onCancel={handleCancel}
            footer={
                <Space align='center'>
                    
                </Space>
            }
            destroyOnClose={true}
            closable={false}
        >
        <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
                <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[
                        {
                        required: true,
                        message: 'Por favor, introduce un nombre!',
                        },
                    ]}
                >
                    <Input
                        defaultValue={defaultFormulario.nombre}
                     />
                </Form.Item>

                <Form.Item
                    label="1º Apellido"
                    name="apellido1"
                    rules={[
                        {
                            required: validarApellido,
                            message: 'Introduce el 1º Apellido!',
                        },
                    ]}
                    >
                    <Input 
                        defaultValue={defaultFormulario.apellido1}
                    />
                </Form.Item>

                <Form.Item
                    label="2º Apellido"
                    name="apellido2"
                    >
                    <Input
                        defaultValue={defaultFormulario.apellido2}
                    />
                </Form.Item>

                <Form.Item
                    label="Documento"
                    name="documento"
                    onChange={(ev) => {console.log(ev.target.value)}
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Introduce un DNI correcto!',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if(value == ""){
                                return Promise.reject(new Error('El documento no puede estar vacio!'));
                            }
                            if (!ValidateSpanishID(value).valid) {
                                let tipoDocumento = ValidateSpanishID(value).type;
                                switch(tipoDocumento){
                                    case "dni":
                                        return Promise.reject(new Error('El '+tipoDocumento+' es incorrecto!'));
                                        break;
                                    case "cif":
                                    case "nie":
                                        return Promise.reject(new Error('El '+tipoDocumento+' es incorrecto!'));
                                        break;
                                    default:
                                        return Promise.reject(new Error('El documento es incorrecto!'));
                                        break;
                                }
                            }else{
                                let tipoDocumento = ValidateSpanishID(value).type;
                                switch(tipoDocumento){
                                    case "dni":
                                        setValidarApellido(false);
                                        break;
                                    case "cif":
                                    case "nie":
                                        setValidarApellido(true);
                                        break;
                                    default:
                                        setValidarApellido(false);
                                        break;
                                }
                                return Promise.resolve()
                            }
                          }
                        })
                    ]}
                    >
                    <Input 
                        defaultValue={defaultFormulario.documento} 
                    />
                </Form.Item>
                
                <Space align="baseline">

                    <Form.Item
                        label="Código postal"
                        name="cp"
                        onChange={(ev) => {getCodigoPostal(ev.target.value)}}
                        rules={[
                            {
                                required: true,
                                pattern: new RegExp(/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/),
                                message: 'Introduce un codigo postal válido!',
                            },
                        ]}
                        >
                        <Input 
                            defaultValue={defaultFormulario.cp}
                        />

                    </Form.Item>
                {textLocalidad}

                </Space>

                <Form.Item
                    label="Dirección"
                    name="direccion"
                    >
                    <Input 
                        defaultValue={defaultFormulario.direccion} 
                    />
                </Form.Item>


                <Form.Item
                    label="Teléfono"
                    name="telefono"
                    
                    rules={[
                        {
                            required: true,
                            pattern: new RegExp(/^(\+34|0034|34)?[67]\d{8}$/),
                            message: 'Introduce teléfono movil válido!',
                        },
                    ]}
                    >
                    <Input 
                        defaultValue={defaultFormulario.telefono}
                    />
                </Form.Item>
                <Form.Item label="">
                    <Button type="primary" htmlType="submit">
                        Enviar
                    </Button>
                </Form.Item>
            </Form>
      </Modal>
    </>
  );

};

export default Formulario;