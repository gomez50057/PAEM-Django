import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import Select from 'react-select';
import validationSchemaStep2 from './validationSchemaStep2';
import { municipiosDeHidalgo, unidadesResponsables, dependencias, organismos, ramoPresupuestalOptions, municipiosPorRegion, unidadPresupuestalPorUnidadResponsable, programaPresupuestarioOptions, indicadoresEstrategicosOptions, indicadoresTacticosOptions, sectorOptions, tipoProyectoOptions, programasSectorialesOptions, planNacionalOptions, acuerdosTransversalesOptions, odsOptions } from '../../../utils';
import SectionTitle from '../componentsForm/SectionTitle';
import ProjectCreationModal from '../componentsForm/ProjectCreationModal';
import DocumentUploadSection from '../componentsForm/DocumentUploadSection';
import TooltipHelp from '../componentsForm/TooltipHelp';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const FormDependencia = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [entityType, setEntityType] = useState('');
  const [selectedUnidadResponsable, setSelectedUnidadResponsable] = useState('');
  const [selectedProgramaPresupuestario, setSelectedProgramaPresupuestario] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPlanEstatal, setSelectedPlanEstatal] = useState('');


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const csrfToken = Cookies.get('csrftoken');
      const response = await axios.post('guardar-proyecto/', values, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      const projectId = response.data.project_id;
      setGeneratedId(projectId);
      setModalIsOpen(true);

      resetForm();
      setSubmitting(false);
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.href = '/';
  };

  const handleMunicipiosImpactoChange = (selectedOptions, setFieldValue) => {
    if (selectedOptions.some((option) => option.value === 'No Aplica')) {
      setFieldValue('municipiosImpacto', [{ value: 'No Aplica', label: 'No Aplica' }]);
    } else {
      setFieldValue('municipiosImpacto', selectedOptions);
    }
  };

  const municipiosOptions = [{ value: 'No Aplica', label: 'No Aplica' }, ...municipiosDeHidalgo.map((mun) => ({ value: mun, label: mun }))];

  const getProgramasSIEValue = (tipoEntidad, dependencia, organismo) => {
    if (tipoEntidad === 'Municipio') {
      return 'No Aplica';
    }

    if (tipoEntidad === 'Dependencia') {
      return programasSectorialesOptions[dependencia] || 'No Aplica';
    }

    if (tipoEntidad === 'Organismo') {
      return programasSectorialesOptions[organismo] || 'No Aplica';
    }

    return 'No Aplica';
  };

  const handleEntityTypeChange = (tipoEntidad, setFieldValue) => {
    setEntityType(tipoEntidad);

    if (tipoEntidad === 'Municipio') {
      // Si seleccionamos Municipio, los otros campos se marcan como "No Aplica"
      setFieldValue('dependencia', 'No Aplica');
      setFieldValue('organismo', 'No Aplica');
      setFieldValue('programasSIE', 'No Aplica');
    } else if (tipoEntidad === 'Dependencia') {
      // Si es Dependencia, los otros campos se marcan como "No Aplica"
      setFieldValue('municipioAyuntamiento', 'No Aplica');
      setFieldValue('organismo', 'No Aplica');
    } else if (tipoEntidad === 'Organismo') {
      // Si es Organismo, los otros campos se marcan como "No Aplica"
      setFieldValue('municipioAyuntamiento', 'No Aplica');
      setFieldValue('dependencia', 'No Aplica');
    }
  };

  // Extrae solo los encabezados de indicadoresEstrategicosOptions
  const planEstatalOptions = Object.keys(indicadoresEstrategicosOptions).map(key => ({
    value: key,
    label: key,
  }));

  // Maneja los cambios en planEstatal
  const handlePlanEstatalChange = (selectedOption, setFieldValue) => {
    const selectedValue = selectedOption ? selectedOption.value : '';
    setSelectedPlanEstatal(selectedValue); // Actualiza el estado de planEstatal
    setFieldValue('planEstatal', selectedValue);
    setFieldValue('indicadoresEstrategicos', ''); // Resetea el campo indicadoresEstrategicos al cambiar planEstatal
  };

  // Obtiene las opciones de indicadoresEstrategicos según el planEstatal seleccionado
  const getIndicadoresEstrategicosOptions = () => {
    return selectedPlanEstatal
      ? indicadoresEstrategicosOptions[selectedPlanEstatal].map(option => ({
        value: option,
        label: option,
      }))
      : [];
  };

  const getIndicadoresTacticosOptions = (tipoEntidad, dependencia) => {
    if (tipoEntidad === 'Dependencia' && dependencia !== 'Secretaría del Despacho del Gobernador') {
      const opciones = indicadoresTacticosOptions[dependencia] || [];
      // Retorna las opciones si existen, si no, devuelve "No Aplica"
      return opciones.length > 0
        ? opciones.map((opcion) => ({ value: opcion, label: opcion }))
        : [{ value: 'No Aplica', label: 'No Aplica' }];
    }
    return [{ value: 'No Aplica', label: 'No Aplica' }];
  };


  return (
    <div className="formulario-container">
      <Formik
        initialValues={{
          projectName: '',
          tipoEntidad: '',
          dependencia: '',
          organismo: '',
          municipioAyuntamiento: '',
          sector: '',
          tipoProyecto: '',
          PeticionPersonal: '',
          unidadResponsable: '',
          unidadPresupuestal: '',
          ramoPresupuestal: '',
          montoFederal: '0',
          montoEstatal: '0',
          montoMunicipal: '0',
          montoOtros: '0',
          inversionEstimada: '0',
          descripcion: '',
          situacionSinProyecto: '',
          objetivos: '',
          metas: '',
          gastoProgramable: '',
          programaPresupuestario: '',
          beneficiarios: '',
          normativaAplicableVigente: '',
          alineacionNormativa: '',
          region: '',
          municipio: '',
          localidad: '',
          barrioColoniaEjido: '',
          latitud: '',
          longitud: '',
          municipiosImpacto: [],
          planNacional: '',
          planEstatal: '',
          planMunicipal: '',
          acuerdosTransversales: '',
          ods: '',
          programasSIE: '',
          indicadoresEstrategicos: '',
          indicadoresTacticos: '',
          indicadoresDesempeno: '',
          indicadoresRentabilidad: '',
        }}
        validationSchema={validationSchemaStep2}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            {/* Registro del Responsable del Proyecto */}
            <SectionTitle title="Registro del Responsable del Proyecto" />
            <div className="form-row">
              <FieldGroup
                name="projectName"
                label="Nombre del Proyecto"
                tooltipText="Indica el nombre del proyecto."
              />
              <CustomSelectField
                name="sector"
                label="Sector"
                options={sectorOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                placeholder="Selecciona una opción"
                tooltipText="Selecciona el sector correspondiente."
                onChange={(option) => {
                  setFieldValue('sector', option.value);
                  const tipoProyecto = tipoProyectoOptions[option.value] || '';
                  setFieldValue('tipoProyecto', tipoProyecto);
                }}
              />
              <FieldGroup
                name="tipoProyecto"
                label="Tipo de Proyecto"
                tooltipText="Este campo se llena automáticamente en base al sector seleccionado."
                readOnly
              />
            </div>

            <div className="form-row">
              <CustomSelectField
                name="tipoEntidad"
                label="Tipo de Entidad"
                options={[
                  { value: 'Dependencia', label: 'Dependencia' },
                  { value: 'Organismo', label: 'Organismo' },
                  { value: 'Municipio', label: 'Municipio' },
                ]}
                placeholder="Selecciona una opción"
                tooltipText="Selecciona el tipo de entidad para el proyecto."
                onChange={(option) => {
                  setFieldValue('tipoEntidad', option.value);
                  handleEntityTypeChange(option.value, setFieldValue);
                }}
              />

              {entityType === 'Dependencia' && (
                <CustomSelectField
                  name="dependencia"
                  label="Dependencia"
                  options={dependencias.map(dep => ({ value: dep, label: dep }))}
                  placeholder="Selecciona una opción"
                  tooltipText="Selecciona la dependencia que gestiona el proyecto."
                  onChange={(option) => {
                    setFieldValue('dependencia', option.value);
                    setFieldValue('programasSIE', getProgramasSIEValue('Dependencia', option.value, values.organismo));
                  }}
                />
              )}

              {entityType === 'Organismo' && (
                <CustomSelectField
                  name="organismo"
                  label="Organismo"
                  options={organismos.map(org => ({ value: org, label: org }))}
                  placeholder="Selecciona una opción"
                  tooltipText="Selecciona el organismo encargado del proyecto."
                  onChange={(option) => {
                    setFieldValue('organismo', option.value);
                    setFieldValue('programasSIE', getProgramasSIEValue('Organismo', values.dependencia, option.value));
                  }}
                />
              )}

              {entityType === 'Municipio' && (
                <CustomSelectField
                  name="municipioAyuntamiento"
                  label="Municipio"
                  options={municipiosDeHidalgo.map(mun => ({ value: mun, label: mun }))}
                  placeholder="Selecciona una opción"
                  tooltipText="Selecciona el municipio que gestionará el proyecto."
                  onChange={(option) => setFieldValue('municipioAyuntamiento', option.value)}
                />
              )}
            </div>

            <div className="form-row">
              <CustomSelectField
                name="unidadResponsable"
                label="Unidad Responsable"
                options={unidadesResponsables.map(unidad => ({ value: unidad, label: unidad }))}
                placeholder="Selecciona una opción"
                tooltipText="Selecciona la unidad responsable del proyecto."
                onChange={(option) => {
                  setFieldValue('unidadResponsable', option.value);
                  setSelectedUnidadResponsable(option.value);
                  setFieldValue('unidadPresupuestal', ''); // Resetea el campo unidadPresupuestal al cambiar la unidadResponsable
                }}
              />

              {selectedUnidadResponsable && (
                <CustomSelectField
                  name="unidadPresupuestal"
                  label="Unidad Presupuestal"
                  options={unidadPresupuestalPorUnidadResponsable[selectedUnidadResponsable]?.map(unidad => ({ value: unidad, label: unidad })) || []}
                  placeholder="Selecciona una opción"
                  tooltipText="Selecciona la unidad presupuestal correspondiente."
                  isDisabled={!selectedUnidadResponsable}
                />
              )}
            </div>

            <div className="form-row">
              <CustomSelectFieldGrouped
                name="ramoPresupuestal"
                label="Ramo Presupuestal"
                options={ramoPresupuestalOptions}
                placeholder="Seleccione una opción"
                tooltipText="Selecciona el ramo presupuestal correspondiente."
                note="Este campo es requerido para el registro del proyecto."
              />
            </div>

            {/* Datos Financieros */}
            <SectionTitle title="Fuentes de Financiamiento" />
            <div className="form-row">
              <FieldGroup
                name="montoFederal"
                label="Monto Federal"
                type="number"
                tooltipText="Indica el monto de financiamiento federal."
                onChange={(e) => {
                  setFieldValue('montoFederal', e.target.value);
                  const total = parseFloat(values.montoFederal || 0) + parseFloat(values.montoEstatal || 0) + parseFloat(values.montoMunicipal || 0) + parseFloat(values.montoOtros || 0);
                  setFieldValue('inversionEstimada', total.toFixed(2));
                }}
              />
              <FieldGroup
                name="montoEstatal"
                label="Monto Estatal"
                type="number"
                tooltipText="Indica el monto de financiamiento estatal."
                onChange={(e) => {
                  setFieldValue('montoEstatal', e.target.value);
                  const total = parseFloat(values.montoFederal || 0) + parseFloat(values.montoEstatal || 0) + parseFloat(values.montoMunicipal || 0) + parseFloat(values.montoOtros || 0);
                  setFieldValue('inversionEstimada', total.toFixed(2));
                }}
              />
              <FieldGroup
                name="montoMunicipal"
                label="Monto Municipal"
                type="number"
                tooltipText="Indica el monto de financiamiento municipal."
                onChange={(e) => {
                  setFieldValue('montoMunicipal', e.target.value);
                  const total = parseFloat(values.montoFederal || 0) + parseFloat(values.montoEstatal || 0) + parseFloat(values.montoMunicipal || 0) + parseFloat(values.montoOtros || 0);
                  setFieldValue('inversionEstimada', total.toFixed(2));
                }}
              />
              <FieldGroup
                name="montoOtros"
                label="Otros Montos"
                type="number"
                tooltipText="Indica cualquier otro tipo de financiamiento."
                onChange={(e) => {
                  setFieldValue('montoOtros', e.target.value);
                  const total = parseFloat(values.montoFederal || 0) + parseFloat(values.montoEstatal || 0) + parseFloat(values.montoMunicipal || 0) + parseFloat(values.montoOtros || 0);
                  setFieldValue('inversionEstimada', total.toFixed(2));
                }}
              />
            </div>

            <div className="form-row">
              <FieldGroup
                name="inversionEstimada"
                label="Inversión Estimada"
                tooltipText="Este campo se calcula automáticamente sumando las fuentes de financiamiento."
                readOnly
              />
            </div>

            <SectionTitle title="Datos del Proyecto" />
            <div className="form-row">
              <FieldGroup
                name="descripcion"
                label="Descripción"
                as="textarea"
                maxLength="1000"
                tooltipText="Describe el proyecto. Máximo 1000 caracteres."
                note="Máximo 1000 caracteres."
              />
            </div>
            <div className="form-row">
              <FieldGroup
                name="situacionSinProyecto"
                label="Situación Sin Proyecto"
                as="textarea"
                maxLength="1000"
                tooltipText="Describe la situación actual sin el proyecto. Máximo 1000 caracteres."
                note="Máximo 1000 caracteres."
              />
            </div>
            <div className="form-row">
              <FieldGroup
                name="objetivos"
                label="Objetivos"
                as="textarea"
                maxLength="500"
                tooltipText="Describe los objetivos del proyecto. Máximo 500 caracteres."
                note="Máximo 500 caracteres."
              />
              <FieldGroup
                name="metas"
                label="Metas"
                as="textarea"
                maxLength="500"
                tooltipText="Indica las metas del proyecto. Máximo 500 caracteres."
                note="Máximo 500 caracteres."
              />
            </div>
            <div className="form-row">
              <CustomSelectField
                name="programaPresupuestario"
                label="Programa Presupuestario"
                options={Object.keys(programaPresupuestarioOptions).map(opt => ({ value: opt, label: opt }))}
                placeholder="Selecciona una opción"
                tooltipText="Selecciona el programa presupuestario."
                onChange={(option) => {
                  setFieldValue('programaPresupuestario', option.value);
                  setSelectedProgramaPresupuestario(option.value);
                }}
              />
              {selectedProgramaPresupuestario && (
                <CustomSelectField
                  name="gastoProgramable"
                  label="Gasto Programable"
                  options={programaPresupuestarioOptions[selectedProgramaPresupuestario]?.map(opt => ({ value: opt, label: opt })) || []}
                  placeholder="Selecciona una opción"
                  tooltipText="Selecciona el gasto programable."
                  isDisabled={!selectedProgramaPresupuestario}
                />
              )}
              <FieldGroup
                name="beneficiarios"
                label="Número de Beneficiarios"
                type="number"
                tooltipText="Indica el número de beneficiarios del proyecto."
              />
            </div>
            <div className="form-row">
              <FieldGroup
                name="normativaAplicableVigente"
                label="Normativa Aplicable Vigente"
                as="textarea"
                maxLength="1500"
                tooltipText="Describe la normativa aplicable vigente. Máximo 1500 caracteres."
                note="Máximo 1500 caracteres."
              />
            </div>

            <SectionTitle title="Territorio y Georreferenciación" />
            <div className="form-row">
              <CustomSelectField
                label="Región"
                name="region"
                options={Object.keys(municipiosPorRegion).map((region) => ({
                  value: region,
                  label: region,
                }))}
                placeholder="Seleccione una región"
                tooltipText="Selecciona la región donde se encuentra el proyecto."
                onChange={(option) => {
                  setFieldValue('region', option.value);
                  setSelectedRegion(option.value);
                  setFieldValue('municipio', ''); // Reinicia el campo municipio al seleccionar una nueva región
                }}
              />

              <CustomSelectField
                label="Municipio"
                name="municipio"
                options={municipiosPorRegion[selectedRegion]?.map((mun) => ({
                  value: mun,
                  label: mun,
                })) || []}
                placeholder="Seleccione un municipio"
                tooltipText="Selecciona el municipio correspondiente a la región seleccionada."
                isDisabled={!selectedRegion}
              />

              <FieldGroup
                name="localidad"
                label="Localidad"
                tooltipText="Ingresa la localidad donde se llevará a cabo el proyecto. Máximo 250 caracteres."
                type="text"
                maxLength="250"
                placeholder="Localidad (máximo 250 caracteres)"
              />

              <FieldGroup
                label="Barrio/Colonia/Ejido"
                name="barrioColoniaEjido"
                tooltipText="Ingresa el barrio, colonia o ejido relacionado al proyecto. Máximo 250 caracteres."
                type="text"
                maxLength="250"
                placeholder="Barrio/Colonia/Ejido (máximo 250 caracteres)"
              />
            </div>

            <div className="form-row">
              <FieldGroup
                label="Latitud"
                name="latitud"
                tooltipText="Ingresa la latitud geográfica del proyecto. Debe ser un valor numérico."
                type="number"
                step="any"
                placeholder="Latitud (ej. 20.1234)"
              />

              <FieldGroup
                label="Longitud"
                name="longitud"
                tooltipText="Ingresa la longitud geográfica del proyecto. Debe ser un valor numérico."
                type="number"
                step="any"
                placeholder="Longitud (ej. -99.5678)"
              />
            </div>

            <div className="form-row">
              <CustomSelectField
                label="Municipios de Impacto"
                name="municipiosImpacto"
                options={municipiosOptions}
                isMulti
                placeholder="Seleccione los municipios de impacto"
                tooltipText="Selecciona los municipios donde el proyecto tendrá impacto. Seleccione 'No Aplica' si no corresponde."
                onChange={(selectedOptions) => handleMunicipiosImpactoChange(selectedOptions, setFieldValue)}
              />
            </div>

            {/* Sección de Alineación Estratégica */}
            <SectionTitle title="Alineación Estratégica" />
            <div className="form-row">
              <CustomSelectField
                name="planNacional"
                label="Plan Nacional de Desarrollo"
                options={planNacionalOptions.map(opt => ({ value: opt, label: opt }))}
                placeholder="Selecciona el plan nacional"
                tooltipText="Selecciona el plan nacional de desarrollo al que se alinea el proyecto."
              />

              <CustomSelectField
                name="planEstatal"
                label="Plan Estatal de Desarrollo"
                options={planEstatalOptions}
                placeholder="Selecciona el plan estatal"
                tooltipText="Selecciona el plan estatal de desarrollo al que se alinea el proyecto."
                onChange={(option) => handlePlanEstatalChange(option, setFieldValue)}
              />
            </div>

            {entityType === 'Municipio' ? (
              <FieldGroup
                name="planMunicipal"
                label="Plan Municipal"
                tooltipText="Ingresa el plan municipal de desarrollo."
                as="textarea"
                maxLength="500"
                placeholder="Máximo 500 caracteres"
              />
            ) : (
              <Field
                type="hidden"
                name="planMunicipal"
                value="No Aplica"
              />
            )}

            <div className="form-row">
              <CustomSelectField
                name="acuerdosTransversales"
                label="Acuerdos Transversales"
                options={acuerdosTransversalesOptions.map(opt => ({ value: opt, label: opt }))}
                placeholder="Selecciona un acuerdo transversal"
                tooltipText="Selecciona los acuerdos transversales relacionados con el proyecto."
              />

              <CustomSelectField
                name="ods"
                label="Objetivos de Desarrollo Sostenible (ODS)"
                options={odsOptions.map(opt => ({ value: opt, label: opt }))}
                placeholder="Selecciona un objetivo de desarrollo sostenible"
                tooltipText="Selecciona los ODS al que se alinea el proyecto."
              />
            </div>

            <div className="form-row">
              <FieldGroup
                name="programasSIE"
                label="Programas Sectoriales Institucionales Especiales (SIE)"
                tooltipText="Este campo se llena automáticamente en base al tipo de entidad seleccionado."
                readOnly
                value={values.programasSIE}
              />
            </div>

            <SectionTitle title="Mecanismos de Evaluación y Seguimiento a Proyectos " />
            <div className="form-row">
              <CustomSelectField
                name="indicadoresEstrategicos"
                label="Indicadores Estratégicos"
                options={getIndicadoresEstrategicosOptions()}
                placeholder="Selecciona un indicador estratégico"
                tooltipText="Selecciona el indicador estratégico correspondiente al plan estatal seleccionado."
                isDisabled={!selectedPlanEstatal}
                onChange={(option) => setFieldValue('indicadoresEstrategicos', option.value)}
              />

              <CustomSelectField
                name="indicadoresTacticos"
                label="Indicadores Tácticos"
                options={getIndicadoresTacticosOptions(entityType, values.dependencia)}
                placeholder="Selecciona un indicador táctico"
                tooltipText="Selecciona los indicadores tácticos correspondientes o 'No Aplica' si no aplica."
              />
            </div>
            <div className="form-row">
              <FieldGroup
                name="indicadoresDesempeno"
                label="Indicadores de Desempeño"
                as="textarea"
                maxLength="1000"
                tooltipText="Indica los indicadores de desempeño del proyecto. Máximo 1000 caracteres."
                note="Máximo 1000 caracteres."
              />

              <FieldGroup
                name="indicadoresRentabilidad"
                label="Indicadores de Rentabilidad"
                as="textarea"
                maxLength="1000"
                tooltipText="Indica los indicadores de rentabilidad del proyecto. Máximo 1000 caracteres."
                note="Máximo 1000 caracteres."
              />
            </div>

            {/* Documentación */}
            <SectionTitle title="Documentación" />
            <DocumentUploadSection applies={{}} values={values} setFieldValue={setFieldValue} />

            <button type="submit" disabled={isSubmitting}>
              Enviar
            </button>
          </Form>
        )}
      </Formik>

      <ProjectCreationModal isOpen={modalIsOpen} onRequestClose={closeModal} projectId={generatedId} />
    </div>
  );
};

/// Componente FieldGroup para simplificar la creación de campos, ahora con soporte para Tooltip y notas
const FieldGroup = ({ label, name, note, tooltipText, children, ...props }) => (
  <div className="form-group">
    <label htmlFor={name} style={{ display: 'flex', alignItems: 'center' }}>
      {label}
      {tooltipText && (
        <div className="tooltip-icon-container">
          <div className="tooltip-icon-support">
            <ContactSupportIcon style={{ marginLeft: '5px', cursor: 'pointer', color: 'var(--doradoOsc)' }} />
            <TooltipHelp id={`${name}-tooltip`} text={tooltipText} />
          </div>
        </div>
      )}
    </label>
    {/* Si el campo tiene hijos (por ejemplo, un componente personalizado), los renderiza */}
    {children ? children : <Field id={name} name={name} {...props} />}
    {note && <p className="field-note">{note}</p>}
    <ErrorMessage name={name} component="div" className="error" />
  </div>
);

// Componente CustomSelectField modificado para integrar React Select con Formik y mostrar tooltip
const CustomSelectField = ({ label, options, name, placeholder, isDisabled = false, tooltipText = '', isMulti = false, onChange }) => {
  const [field, , helpers] = useField(name);

  const handleChange = (selectedOptions) => {
    if (isMulti) {
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
      helpers.setValue(selectedValues);
    } else {
      helpers.setValue(selectedOptions ? selectedOptions.value : '');
    }
    if (onChange) {
      onChange(selectedOptions);
    }
  };

  const selectedOption = options ? (isMulti ? options.filter(option => field.value.includes(option.value)) : options.find(option => option.value === field.value)) : '';

  return (
    <div className="form-group" style={{ borderRadius: '15px' }}>
      <label htmlFor={name} style={{ display: 'flex', alignItems: 'center' }}>
        {label}
        {tooltipText && (
          <div className="tooltip-icon-container">
            <div className="tooltip-icon-support">
              <ContactSupportIcon style={{ marginLeft: '5px', cursor: 'pointer', color: 'var(--doradoOsc)' }} />
              <TooltipHelp id={`${name}-tooltip`} text={tooltipText} />
            </div>
          </div>
        )}
      </label>
      <Select
        className="form-select"
        id={name}
        options={options}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isMulti={isMulti}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({ ...base, borderRadius: '15px' }),
        }}
        menuPlacement="auto"
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};

// Implementación del Select con optgroup
const CustomSelectFieldGrouped = ({ label, options, name, placeholder, isDisabled = false, tooltipText = '', onChange, note }) => {
  const [field, , helpers] = useField(name);

  const handleChange = (selectedOption) => {
    helpers.setValue(selectedOption ? selectedOption.value : '');
    if (onChange) {
      onChange(selectedOption);
    }
  };

  const selectedOption = options?.find(opt =>
    opt.options.some(option => option.value === field.value)
  )?.options.find(option => option.value === field.value);

  return (
    <FieldGroup
      label={label}
      name={name}
      note={note}
      tooltipText={tooltipText}
    >
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({ ...base, borderRadius: '15px' }),
        }}
      />
    </FieldGroup>
  );
};

export default FormDependencia;
